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
            $dayStart = $startDate->copy()->setHour(8)->setMinute(0);
            $dayEnd = $startDate->copy()->setHour(21)->setMinute(0);

            // Create 5-15 schedules per day
            $dailySchedules = rand(5, 15);

            for ($i = 0; $i < $dailySchedules; $i++) {
                $user = $users->random();
                $machine = $machines->random();

                // Calculate duration and latest start time based on machine type
                $duration = $machine->type === 'wash' ? 3 : 1;
                $latestStartHour = $machine->type === 'wash' ? 18 : 20;

                // Generate random start hour between 8 and latest start hour
                $startTime = $dayStart->copy()->setHour(
                    rand(8, $latestStartHour)
                )->setMinute(0);
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
