<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\SurveyAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $surveys = Survey::with('questions')
            ->withCount('responses')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($surveys);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'in:Draft,Active,Closed',
            'questions'   => 'array',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:text,rating,yes_no,multiple_choice',
            'questions.*.options' => 'nullable|string',
        ]);

        $survey = Survey::create([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'status'      => $data['status'] ?? 'Draft',
            'created_by'  => $request->user()->id,
        ]);

        foreach ($data['questions'] ?? [] as $q) {
            $survey->questions()->create($q);
        }

        return response()->json($survey->load('questions'), 201);
    }

    public function destroy(Survey $survey): JsonResponse
    {
        $survey->delete();
        return response()->json(['message' => 'Survey deleted']);
    }

    public function respond(Request $request, Survey $survey): JsonResponse
    {
        $data = $request->validate([
            'answers'              => 'required|array',
            'answers.*.question_id' => 'required|exists:survey_questions,id',
            'answers.*.answer'      => 'required|string',
        ]);

        $response = SurveyResponse::create([
            'survey_id' => $survey->id,
            'user_id'   => $request->user()->id,
        ]);

        foreach ($data['answers'] as $answer) {
            SurveyAnswer::create([
                'survey_response_id' => $response->id,
                'survey_question_id' => $answer['question_id'],
                'answer'             => $answer['answer'],
            ]);
        }

        return response()->json(['message' => 'Response submitted'], 201);
    }
}
