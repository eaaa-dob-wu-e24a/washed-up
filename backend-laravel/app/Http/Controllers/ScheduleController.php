<?php

namespace App\Http\Controllers;

use App\Models\Credits;
use App\Models\CreditUsage;
use App\Models\Machine;
use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Notifications\NewSampleNotification;
use Illuminate\Support\Carbon;

class ScheduleController extends Controller {
    public function index() {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function show($machine_id) {
        $schedules = Schedule::where('machine_id', $machine_id)->get();
        return response()->json($schedules);
    }

    public function getById($id) {
        $schedule = Schedule::findOrFail($id);
        return response()->json($schedule);
    }


    public function adminIndex() {
        $user = Auth::user();

        $schedules = Schedule::with(['user', 'machine'])
            ->whereHas('machine', function ($query) use ($user) {
                $query->where('location_id', $user->location_id);
            })
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->json($schedules);
    }

    public function store(Request $request) {
        // First check if the machine exists and is enabled (status = 1)
        $machine = Machine::find($request->machine_id);
        if (!$machine || $machine->status !== 1) {
            return response()->json(['error' => 'Machine is not available for booking'], 400);
        }

        if ($this->hasOverlap($request->machine_id, $request->start_time, $request->end_time)) {
            return response()->json(['error' => 'Schedule overlaps with an existing entry'], 409);
        }

        $duration = (strtotime($request->end_time) - strtotime($request->start_time)) / 60;
        $duration_in_hours = $duration / 60;

        $user = Auth::user();
        $credits = Credits::where('user_id', $user->id)->first();

        if ($credits->amount - ($duration_in_hours) < 0) {
            return response()->json(['error' => 'Insufficient credits'], 400);
        }

        $schedule = Schedule::create([
            'user_id' => $user->id,
            'machine_id' => $request->machine_id,
            'machine_type' => $request->machine_type,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        CreditUsage::create([
            'user_id' => $user->id,
            'machine_id' => $request->machine_id,
            'machine_type' => $request->machine_type,
            'duration_minutes' => $duration,
            'cost_credits' => $duration_in_hours,
            'type' => 'purchase',
            'balance_after' => $credits->amount - ($duration_in_hours),
        ]);

        Credits::where('user_id', $user->id)->update([
            'amount' => $credits->amount - ($duration_in_hours),
        ]);

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

    public function destroyWithNotification($id) {
        $schedule = Schedule::findOrFail($id);
        $machine = Machine::findOrFail($schedule->machine_id);
        $duration = (strtotime($schedule->end_time) - strtotime($schedule->start_time)) / 60;
        $duration_in_hours = $duration / 60;

        $user = User::find($schedule->user_id);
        $credits = Credits::where('user_id', $user->id)->first();

        // Create credit usage record for refund
        CreditUsage::create([
            'user_id' => $user->id,
            'machine_id' => $schedule->machine_id,
            'machine_type' => $machine->type,
            'duration_minutes' => $duration,
            'cost_credits' => $duration_in_hours,
            'type' => 'refund',
            'balance_after' => $credits->amount + $duration_in_hours,
        ]);

        // Update user's credits
        Credits::where('user_id', $user->id)->update([
            'amount' => $credits->amount + $duration_in_hours,
        ]);

        // Delete the schedule
        $schedule->delete();

        $user = User::find($user->id);

        $user->notify(new NewSampleNotification(
            'Your schedule time has been deleted!',
            'Your schedule has been deleted by your admin. You have been refunded ' . $duration_in_hours . ' credits.'
        ));

        return response()->json(null, 204);
    }

    public function destroy($id) {
        $schedule = Schedule::findOrFail($id);
        $user = Auth::user();

        // Check if the user owns this schedule
        if ($schedule->user_id !== $user->id) {
            return response()->json([
                'error' => 'Unauthorized to cancel this schedule'
            ], 403);
        }

        // Check if schedule is currently active
        $now = Carbon::now()->addHour();
        $startTime = Carbon::parse($schedule->start_time);
        $endTime = Carbon::parse($schedule->end_time);

        if ($now->between($startTime, $endTime)) {
            return response()->json([
                'error' => 'Cannot cancel an active schedule'
            ], 400);
        }

        $machine = Machine::findOrFail($schedule->machine_id);
        $duration = (strtotime($schedule->end_time) - strtotime($schedule->start_time)) / 60;
        $duration_in_hours = $duration / 60;

        $credits = Credits::where('user_id', $user->id)->first();

        // Create credit usage record for refund
        CreditUsage::create([
            'user_id' => $user->id,
            'machine_id' => $schedule->machine_id,
            'machine_type' => $machine->type,
            'duration_minutes' => $duration,
            'cost_credits' => $duration_in_hours,
            'type' => 'refund',
            'balance_after' => $credits->amount + $duration_in_hours,
        ]);

        // Update user's credits
        Credits::where('user_id', $user->id)->update([
            'amount' => $credits->amount + $duration_in_hours,
        ]);

        // Delete the schedule
        $schedule->delete();

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
