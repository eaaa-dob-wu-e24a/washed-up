<?php

namespace App\Http\Controllers;

use App\Models\Credits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $credits = Credits::where('user_id', $user->id)->get();
        return response()->json($credits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'amount' => 'required|integer|min:1',
        ]);

        $credit = Credits::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
        ]);
        return response()->json($credit);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $credit = Credits::where('user_id', $user->id)->first();
        $credit->amount += $request->amount;
        $credit->save();
        return response()->json($credit);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $user = Auth::user();
        $credit = Credits::where('user_id', $user->id)->first();
        $credit->delete();
        return response()->json(['message' => 'Credit deleted']);
    }
}
