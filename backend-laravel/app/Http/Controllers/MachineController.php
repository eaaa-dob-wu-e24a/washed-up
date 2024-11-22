<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use Illuminate\Http\Request;

class MachineController extends Controller {
    public function index() {
        $machines = Machine::with('location')->get();
        return response()->json($machines);
    }

    public function show($id) {
        $machine = Machine::with('location')->findOrFail($id);
        return response()->json($machine);
    }

    public function store(Request $request) {
        $machine = Machine::create($request->all());
        return response()->json($machine, 201);
    }

    public function update(Request $request, $id) {
        $machine = Machine::findOrFail($id);
        $machine->update($request->all());
        return response()->json($machine, 200);
    }

    public function destroy($id) {
        Machine::destroy($id);
        return response()->json(null, 204);
    }
}
