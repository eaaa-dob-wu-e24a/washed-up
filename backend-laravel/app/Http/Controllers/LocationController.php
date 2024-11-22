<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        $locations = Location::all();
        return response()->json($locations);
    }

    public function store(Request $request)
    {
        $location = new Location();
        $location->name = $request->name;
        $location->save();
        return response()->json(['message' => 'Location created!'], 201);
    }

    public function show($id)
    {
        $location = Location::find($id);
        if (!empty($location)) {
            return response()->json($location);
        } else {
            return response()->json(['message' => 'Location not found!'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        if (Location::where('id', $id)->exists()) {
            $location = Location::find($id);
            $location->name = is_null($request->name)
                ? $location->name
                : $request->name;
            $location->save();

            return response()->json(
                [
                    'message' => 'Location updated successfully',
                ],
                200
            );
        } else {
            return response()->json(
                [
                    'message' => 'Location not found',
                ],
                404
            );
        }
    }

    public function destroy($id)
    {
        if (Location::where('id', $id)->exists()) {
            $location = Location::find($id);
            $location->delete();

            return response()->json(
                [
                    'message' => 'Location deleted',
                ],
                202
            );
        } else {
            return response()->json(
                [
                    'message' => 'Location not found',
                ],
                404
            );
        }
    }
}
