<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        $departments = Department::with('head')->withCount('profiles')->get();
        return response()->json($departments->map(fn($d) => [
            'id'          => $d->id,
            'name'        => $d->name,
            'description' => $d->description,
            'head'        => $d->head?->name,
            'head_user_id'=> $d->head_user_id,
            'employees'   => $d->profiles_count,
        ]));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'         => 'required|string|unique:departments,name',
            'description'  => 'nullable|string',
            'head_user_id' => 'nullable|exists:users,id',
        ]);
        $dept = Department::create($data);
        return response()->json($dept, 201);
    }

    public function update(Request $request, Department $department): JsonResponse
    {
        $data = $request->validate([
            'name'         => 'nullable|string|unique:departments,name,' . $department->id,
            'description'  => 'nullable|string',
            'head_user_id' => 'nullable|exists:users,id',
        ]);
        $department->update($data);
        return response()->json($department->fresh('head'));
    }

    public function destroy(Department $department): JsonResponse
    {
        $department->delete();
        return response()->json(['message' => 'Department removed']);
    }
}
