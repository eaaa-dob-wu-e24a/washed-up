<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MachineController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $machines = Machine::with('location')
            ->where('location_id', $user->location_id)
            ->get();
        return response()->json($machines);
    }

    public function show($id)
    {
        $user = Auth::user();
        $machine = Machine::with('location')
            ->where('id', $id)
            ->where('location_id', $user->location_id)
            ->first();

        if (!$machine) {
            return response()->json(['error' => 'Machine not found'], 404);
        } else {
            return response()->json($machine);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $data = $request->all();

        $request->validate([
            'type' => 'required|in:wash,dry'
        ]);

        if ($data['location_id'] != $user->location_id) {
            return response()->json(['error' => 'You cannot add a machine to this location.'], 403);
        } else {
            $machine = Machine::create($data);
            return response()->json($machine, 201);
        }
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $machine = Machine::where('id', $id)
            ->where('location_id', $user->location_id)
            ->first();
        if (!$machine) {
            return response()->json(['error' => 'Machine not found'], 404);
        } else {
            $machine->update($request->all());
            return response()->json($machine, 200);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $machine = Machine::where('id', $id)
            ->where('location_id', $user->location_id)
            ->first();
        if (!$machine) {
            return response()->json(['error' => 'Machine not found'], 404);
        } else {
            $machine->delete();
            return response()->json(['success' => 'Machine was deleted'], 200);
        }
    }
}
