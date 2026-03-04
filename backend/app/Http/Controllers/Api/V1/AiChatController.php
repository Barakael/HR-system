<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;

class AiChatController extends Controller
{
    /**
     * List conversations for the authenticated user.
     */
    public function conversations(Request $request)
    {
        $conversations = ChatConversation::where('user_id', $request->user()->id)
            ->orderByDesc('updated_at')
            ->take(30)
            ->get(['id', 'title', 'updated_at']);

        return response()->json($conversations);
    }

    /**
     * Get messages for a conversation.
     */
    public function messages(Request $request, ChatConversation $conversation)
    {
        if ($conversation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($conversation->messages()->orderBy('id')->get());
    }

    /**
     * Send a message and get AI response.
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|integer|exists:chat_conversations,id',
        ]);

        $user = $request->user();

        // Ensure HR admin
        if (!$user->hasRole('hr_admin')) {
            return response()->json(['message' => 'Only HR administrators can use AI chat.'], 403);
        }

        $apiKey = config('services.openai.key');
        if (empty($apiKey)) {
            return response()->json(['message' => 'OpenAI API key not configured. Add OPENAI_API_KEY to .env'], 500);
        }

        // Get or create conversation
        if ($request->conversation_id) {
            $conversation = ChatConversation::where('id', $request->conversation_id)
                ->where('user_id', $user->id)
                ->firstOrFail();
        } else {
            $conversation = ChatConversation::create([
                'user_id' => $user->id,
                'title' => \Illuminate\Support\Str::limit($request->message, 60),
            ]);
        }

        // Save user message
        ChatMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $request->message,
        ]);

        // Build context: recent messages in this conversation
        $recentMessages = $conversation->messages()
            ->orderByDesc('id')
            ->take(10)
            ->get()
            ->reverse()
            ->values()
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->toArray();

        // Get database schema for RAG context
        $schemaContext = $this->getDatabaseSchema();

        $systemPrompt = <<<PROMPT
You are an HR System AI assistant. You help HR administrators query and understand their company's HR database.

DATABASE SCHEMA:
{$schemaContext}

RULES:
1. When the user asks about data in the system, generate a SQL SELECT query to retrieve it.
2. ONLY generate SELECT queries. Never generate INSERT, UPDATE, DELETE, DROP, ALTER, or any data-modifying SQL.
3. Always limit results to 100 rows maximum (add LIMIT 100 if not present).
4. Wrap your SQL in ```sql ... ``` code blocks so it can be extracted.
5. After the SQL result is returned, explain the results in a clear, friendly manner.
6. If the question doesn't need a database query, just answer directly with your knowledge about HR best practices.
7. Use table/column names exactly as they appear in the schema.
8. For user names, join with the 'users' table. The 'users' table has: id, name, email.
9. When counting or aggregating, use appropriate SQL functions.
10. If you're unsure about the exact column names, say so rather than guessing.

Respond in a helpful, concise manner appropriate for an HR professional.
PROMPT;

        $messages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $recentMessages
        );

        try {
            // Call OpenAI
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => config('services.openai.model', 'gpt-4o-mini'),
                'messages' => $messages,
                'max_tokens' => 1500,
                'temperature' => 0.1,
            ]);

            if (!$response->successful()) {
                $errorBody = $response->json();
                $errorMessage = $errorBody['error']['message'] ?? 'OpenAI API error';
                throw new \Exception($errorMessage);
            }

            $aiContent = $response->json('choices.0.message.content') ?? 'Sorry, I could not generate a response.';

            // Extract SQL if present
            $sqlQuery = null;
            $queryResult = null;
            if (preg_match('/```sql\s*(.*?)\s*```/si', $aiContent, $matches)) {
                $sqlQuery = trim($matches[1]);

                // Safety: only allow SELECT
                $normalized = strtoupper(trim($sqlQuery));
                if (str_starts_with($normalized, 'SELECT')) {
                    // Ensure LIMIT exists
                    if (!preg_match('/\bLIMIT\b/i', $sqlQuery)) {
                        $sqlQuery = rtrim($sqlQuery, "; \n\r\t") . ' LIMIT 100';
                    }

                    try {
                        $queryResult = DB::select(DB::raw($sqlQuery));

                        // Format results into readable text
                        if (!empty($queryResult)) {
                            $resultArray = array_map(fn($row) => (array) $row, $queryResult);
                            $count = count($resultArray);
                            $resultText = "\n\n**Query Results** ({$count} rows):\n";
                            $resultText .= $this->formatResultsAsTable($resultArray);
                            $aiContent .= $resultText;
                        } else {
                            $aiContent .= "\n\n**Query Results**: No data found.";
                        }
                    } catch (\Exception $e) {
                        $aiContent .= "\n\n**Query Error**: Could not execute query - " . $e->getMessage();
                        $sqlQuery = $sqlQuery . ' -- ERROR: ' . $e->getMessage();
                    }
                } else {
                    $aiContent .= "\n\n⚠️ Non-SELECT queries are blocked for safety.";
                    $sqlQuery = null;
                }
            }

            // Save assistant message
            ChatMessage::create([
                'conversation_id' => $conversation->id,
                'role' => 'assistant',
                'content' => $aiContent,
                'sql_query' => $sqlQuery,
            ]);

            $conversation->touch();

            return response()->json([
                'conversation_id' => $conversation->id,
                'message' => $aiContent,
                'sql_query' => $sqlQuery,
            ]);

        } catch (\Exception $e) {
            $errorReply = "Sorry, I encountered an error: " . $e->getMessage();

            ChatMessage::create([
                'conversation_id' => $conversation->id,
                'role' => 'assistant',
                'content' => $errorReply,
            ]);

            return response()->json([
                'conversation_id' => $conversation->id,
                'message' => $errorReply,
            ], 500);
        }
    }

    /**
     * Get the database schema as a string for the system prompt.
     */
    private function getDatabaseSchema(): string
    {
        $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");

        $schema = '';
        foreach ($tables as $table) {
            $tableName = $table->name;

            // Skip internal tables
            if (in_array($tableName, ['migrations', 'personal_access_tokens', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'sessions', 'password_reset_tokens', 'chat_conversations', 'chat_messages'])) {
                continue;
            }

            $columns = DB::select("PRAGMA table_info(\"{$tableName}\")");
            $colDefs = [];
            foreach ($columns as $col) {
                $colDefs[] = "    {$col->name} {$col->type}" . ($col->pk ? ' PRIMARY KEY' : '') . ($col->notnull ? ' NOT NULL' : '');
            }
            $schema .= "{$tableName} (\n" . implode(",\n", $colDefs) . "\n)\n\n";
        }

        return $schema;
    }

    /**
     * Format query results as a markdown table.
     */
    private function formatResultsAsTable(array $rows): string
    {
        if (empty($rows)) return '';

        $headers = array_keys($rows[0]);

        // Limit columns for readability
        if (count($headers) > 8) {
            $headers = array_slice($headers, 0, 8);
            $rows = array_map(fn($r) => array_slice($r, 0, 8, true), $rows);
        }

        // Limit rows
        $displayRows = array_slice($rows, 0, 20);

        $table = "\n| " . implode(' | ', $headers) . " |\n";
        $table .= "| " . implode(' | ', array_fill(0, count($headers), '---')) . " |\n";

        foreach ($displayRows as $row) {
            $values = [];
            foreach ($headers as $h) {
                $val = $row[$h] ?? '';
                $val = str_replace(['|', "\n", "\r"], ['\|', ' ', ''], (string) $val);
                $values[] = \Illuminate\Support\Str::limit((string) $val, 40);
            }
            $table .= "| " . implode(' | ', $values) . " |\n";
        }

        if (count($rows) > 20) {
            $table .= "\n*... and " . (count($rows) - 20) . " more rows*";
        }

        return $table;
    }
}
