<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\Rental;
use App\Models\User;
use App\Models\Machine;

class RentalSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        // Ensure there are some users and machines to associate with rentals
        $users = User::all();
        $machines = Machine::all();

        if ($users->isEmpty()) {
            $users = User::factory()->count(10)->create();
        }

        if ($machines->isEmpty()) {
            $machines = Machine::factory()->count(10)->create();
        }

        foreach ($users as $user) {
            $machine = $machines->random();
            $starttime = Carbon::now()->addHours(rand(1, 8));
            Rental::create([
                'user_id' => $user->id,
                'machine_id' => $machine->id,
                'start_time' => $starttime,
                'end_time' => $starttime->copy()->addHours(rand(1, 8)),
            ]);
        }
    }
}
