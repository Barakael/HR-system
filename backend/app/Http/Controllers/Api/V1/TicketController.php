<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SupportTicket::with('user:id,name', 'assignee:id,name');

        if (!$request->user()->hasRole('hr_admin')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->orderByDesc('created_at')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject'     => 'required|string|max:255',
            'description' => 'required|string',
            'category'    => 'required|string',
            'priority'    => 'in:Low,Medium,High,Critical',
        ]);

        $ticket = SupportTicket::create([
            ...$data,
            'user_id'  => $request->user()->id,
            'priority' => $data['priority'] ?? 'Medium',
            'status'   => 'Open',
        ]);

        return response()->json($ticket->load('user:id,name'), 201);
    }

    public function update(Request $request, SupportTicket $ticket): JsonResponse
    {
        $data = $request->validate([
            'status'      => 'sometimes|in:Open,In Progress,Resolved,Closed',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
            'priority'    => 'sometimes|in:Low,Medium,High,Critical',
        ]);

        $ticket->update($data);
        return response()->json($ticket->fresh()->load('user:id,name', 'assignee:id,name'));
    }
}
