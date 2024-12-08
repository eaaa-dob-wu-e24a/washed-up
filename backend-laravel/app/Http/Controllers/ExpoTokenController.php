<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ExpoTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        $request->validate([
            'token' => 'required|string'
        ]);

        // Create or update the token
        ExpoToken::updateOrCreate(
            [
                'owner_id' => $request->user()->id,
                'owner_type' => $user->role,
                'value' => $request->token,
            ],
            [
                'owner_id' => $request->user()->id,
                'owner_type' => $user->role,
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

        ExpoToken::where('owner_id', $request->user()->id)
            ->where('value', $request->token)
            ->delete();

        return response()->json([
            'message' => 'Expo token removed successfully'
        ]);
    }
}
