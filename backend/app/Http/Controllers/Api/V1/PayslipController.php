<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payslip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PayslipController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->hasRole('hr_admin')
            ? Payslip::with('user:id,name,email')
            : Payslip::where('user_id', $request->user()->id);

        $payslips = $query->orderByDesc('period_start')->get()->map(fn($p) => [
            'id'           => $p->id,
            'period'       => $p->period,
            'period_start' => $p->period_start,
            'period_end'   => $p->period_end,
            'gross'        => $p->gross,
            'deductions'   => $p->deductions,
            'net'          => $p->net,
            'status'       => $p->status,
            'employee'     => $p->user?->name,
        ]);

        return response()->json($payslips);
    }

    public function download(Payslip $payslip, Request $request): mixed
    {
        // Employees can only download their own payslips
        if (!$request->user()->hasRole('hr_admin') && $payslip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($payslip->file_path && Storage::exists($payslip->file_path)) {
            return Storage::download($payslip->file_path);
        }

        return response()->json(['message' => 'File not found'], 404);
    }
}
