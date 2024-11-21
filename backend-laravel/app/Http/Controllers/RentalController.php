<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rental;

class RentalController extends Controller {
    public function index() {
        $rentals = Rental::all();
        return response()->json($rentals);
    }

    public function show($id) {
        $rental = Rental::findOrFail($id);
        return response()->json($rental);
    }

    public function store(Request $request) {
        $rental = Rental::create($request->all());
        return response()->json($rental, 201);
    }

    public function update(Request $request, $id) {
        $rental = Rental::findOrFail($id);
        $rental->update($request->all());
        return response()->json($rental, 200);
    }

    public function destroy($id) {
        Rental::destroy($id);
        return response()->json(null, 204);
    }
}
