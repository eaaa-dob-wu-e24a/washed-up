<?php

namespace App\Http\Controllers;

use App\Models\CreditUsage;
use Illuminate\Support\Facades\Auth;

class CreditUsageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $creditUsages = CreditUsage::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        if (!$creditUsages) {
            return response()->json(['message' => 'No credit usages found'], 404);
        }
        return response()->json($creditUsages);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $creditUsage = CreditUsage::where('user_id', $user->id)->find($id);
        if (!$creditUsage) {
            return response()->json(['message' => 'Credit usage not found'], 404);
        }
        return response()->json($creditUsage);
    }
}
