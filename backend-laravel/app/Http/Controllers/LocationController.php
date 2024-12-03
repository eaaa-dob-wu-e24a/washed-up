<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Support\Facades\Auth;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    public function show()
    {
        $user = Auth::user();

        $location = Location::find($user->location_id);
        return response()->json($location);
    }

    public function getByCode(string $code)
    {
        $location = Location::where('code', $code)->firstOrFail();
        return response()->json($location);
    }
}
