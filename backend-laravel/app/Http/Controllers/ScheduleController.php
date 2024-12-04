<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;

class ScheduleController extends Controller {
    public function index() {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function show($machine_id) {
        $schedules = Schedule::where('machine_id', $machine_id)->get();
        return response()->json($schedules);
    }

    public function store(Request $request) {
        if ($this->hasOverlap($request->machine_id, $request->start_time, $request->end_time)) {
            return response()->json(['error' => 'Schedule overlaps with an existing entry'], 409);
        }

        $schedule = Schedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function update(Request $request, $id) {
        if ($this->hasOverlap($request->machine_id, $request->start_time, $request->end_time, $id)) {
            return response()->json(['error' => 'Schedule overlaps with an existing entry'], 409);
        }

        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->all());
        return response()->json($schedule, 200);
    }

    public function destroy($id) {
        Schedule::destroy($id);
        return response()->json(null, 204);
    }

    private function hasOverlap($machine_id, $start_time, $end_time, $exclude_id = null) {
        $query = Schedule::where('machine_id', $machine_id)
            ->where(function ($query) use ($start_time, $end_time) {
                $query->where('start_time', '<', $end_time)
                    ->where('end_time', '>', $start_time)
                    ->orWhere(function ($query) use ($start_time, $end_time) {
                        $query->where('start_time', '<', $start_time)
                            ->where('end_time', '>', $end_time);
                    });
            });

        if ($exclude_id) {
            $query->where('id', '!=', $exclude_id);
        }

        return $query->exists();
    }
}
