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


class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::all();
        return response()->json($schedules);
    }

    public function show($machine_id)
    {
        $schedules = Schedule::where('machine_id', $machine_id)->get();
        return response()->json($schedules);
    }

    public function store(Request $request)
    {
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

    public function update(Request $request, $id)
    {
        if ($this->hasOverlap($request->machine_id, $request->start_time, $request->end_time, $id)) {
            return response()->json(['error' => 'Schedule overlaps with an existing entry'], 409);
        }

        $schedule = Schedule::findOrFail($id);
        $schedule->update($request->all());
        return response()->json($schedule, 200);
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $machine = Machine::findOrFail($schedule->machine_id);
        $duration = (strtotime($schedule->end_time) - strtotime($schedule->start_time)) / 60;
        $duration_in_hours = $duration / 60;

        $user = Auth::user();
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

    private function hasOverlap($machine_id, $start_time, $end_time, $exclude_id = null)
    {
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
