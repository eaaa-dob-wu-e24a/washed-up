<?php

namespace App\Http\Controllers;

use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }
}
