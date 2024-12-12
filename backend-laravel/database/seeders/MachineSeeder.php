<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Machine;
use App\Models\Location;

class MachineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = Location::all();

        foreach ($locations as $location) {
            // Generate 2-5 machines per location
            $numMachines = rand(2, 5);

            for ($i = 0; $i < $numMachines; $i++) {
                Machine::create([
                    'type' => rand(0, 1) ? 'wash' : 'dry',
                    'location_id' => $location->id,
                    'status' => true,
                ]);
            }
        }
    }
}
