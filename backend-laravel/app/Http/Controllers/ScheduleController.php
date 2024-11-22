<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function show($id)
    {
        $schedule = Schedule::findOrFail($id);
        return response()->json($schedule);
    }

    public function store(Request $request)
    {
        $schedule = Schedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->all());
        return response()->json($schedule, 200);
    }

    public function destroy($id)
    {
        Schedule::destroy($id);
        return response()->json(null, 204);
    }
}
