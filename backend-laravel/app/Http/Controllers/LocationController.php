<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
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

    public function updatePricing(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'price_per_credit' => 'required|numeric',
            'currency' => 'required|string'
        ]);

        $location = Location::find($user->location_id);
        $location->update($request->only(['price_per_credit', 'currency']));

        return response()->json($location);
    }

    public function getByCode(string $code)
    {
        $location = Location::where('code', $code)->firstOrFail();
        return response()->json($location);
    }
}
