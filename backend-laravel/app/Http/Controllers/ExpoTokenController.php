<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;
use Illuminate\Http\JsonResponse;

class ExpoTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        // Delete any existing tokens for this user (optional)
        // Uncomment if you want only one token per user
        // $request->user()->expoTokens()->delete();

        // Create or update the token
        ExpoToken::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'value' => $request->token,
            ],
            [
                'user_id' => $request->user()->id,
                'value' => $request->token,
            ]
        );

        return response()->json([
            'message' => 'Expo token stored successfully'
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $request->user()->expoTokens()
            ->where('value', $request->token)
            ->delete();

        return response()->json([
            'message' => 'Expo token removed successfully'
        ]);
    }
}
