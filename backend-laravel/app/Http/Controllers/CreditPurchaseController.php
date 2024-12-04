<?php

namespace App\Http\Controllers;

use App\Models\CreditPurchase;
use Illuminate\Support\Facades\Auth;

class CreditPurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $creditPurchases = CreditPurchase::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        if (!$creditPurchases) {
            return response()->json(['message' => 'No credit purchases found'], 404);
        }
        return response()->json($creditPurchases);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $creditPurchase = CreditPurchase::where('user_id', $user->id)->find($id);
        if (!$creditPurchase) {
            return response()->json(['message' => 'Credit purchase not found'], 404);
        }
        return response()->json($creditPurchase);
    }
}
