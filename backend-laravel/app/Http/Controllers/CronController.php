<?php

namespace App\Http\Controllers;

class CronController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Hello, World!']);
    }
}
