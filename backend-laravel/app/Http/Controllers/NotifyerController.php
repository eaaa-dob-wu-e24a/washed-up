<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\User;
use App\Notifications\NewSampleNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;

class NotifyerController extends Controller
{
    //

    public function users(Request $request)
    {
        $user = Auth::user();

        // Get unique users who have expo tokens
        $users = User::join('expo_tokens', 'users.id', '=', 'expo_tokens.owner_id')
            ->where('users.location_id', $user->location_id)
            ->select('users.id', 'users.name', 'users.email', 'users.role')
            ->distinct()
            ->get();

        return response()->json($users);
    }

    public function sendNotification(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'title' => 'required|string',
            'body' => 'required|string',
        ]);

        $user = Auth::user();

        $users_ids = $request->input('users') ?? [];

        $users = User::whereIn('id', $users_ids)->get();

        foreach ($users as $user) {
            $user->notify(new NewSampleNotification($request->input('title'), $request->input('body')));
        }

        return response()->json(['message' => 'Notifications sent successfully']);
    }
}
