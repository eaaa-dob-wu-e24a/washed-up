<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Machine;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $machines = Machine::all();
        $startDate = Carbon::parse('2023-12-10');
        $endDate = Carbon::parse('2024-12-10');

        while ($startDate->lte($endDate)) {
            // Skip if it's past 21:00
            $dayStart = $startDate->copy()->setHour(8)->setMinute(0);
            $dayEnd = $startDate->copy()->setHour(21)->setMinute(0);

            // Create 5-15 schedules per day
            $dailySchedules = rand(5, 15);

            for ($i = 0; $i < $dailySchedules; $i++) {
                $user = $users->random();
                $machine = $machines->random();

                // Calculate duration based on machine type
                $duration = $machine->type === 'wash' ? 3 : 1;

                // Generate random start time between 8:00 and 21:00
                $startTime = $dayStart->copy()->addMinutes(rand(0, (13 * 60) - ($duration * 60)));
                $endTime = $startTime->copy()->addHours($duration);

                // Only create if end time is before 21:00
                if ($endTime->lte($dayEnd)) {
                    Schedule::create([
                        'user_id' => $user->id,
                        'machine_id' => $machine->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                    ]);
                }
            }

            $startDate->addDay();
        }
    }
}
