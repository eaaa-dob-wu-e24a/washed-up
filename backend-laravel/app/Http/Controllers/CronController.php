<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\NewSampleNotification;

class CronController extends Controller
{
    public function index()
    {
        // $users = User::all();

        // foreach ($users as $user) {
        //     $user->notify(new NewSampleNotification('Hov der er vidst noget du har glemt', "Husk at blive Washed Up"));
        // }

        return response()->json(['message' => 'Hello, World!']);
    }
}
