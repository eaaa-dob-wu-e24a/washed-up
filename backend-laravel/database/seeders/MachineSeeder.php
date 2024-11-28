<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Machine;
use App\Models\Location;

class MachineSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $faker = \Faker\Factory::create();

        $locations = Location::all();

        if ($locations->isEmpty()) {
            $locations = Location::factory()->count(10)->create();
        }

        for ($i = 0; $i < 100; $i++) {
            Machine::create([
                'model' => $faker->randomElement(['wash', 'dry']),
                'location_id' => $locations->random()->id,
                'status' => $faker->boolean,
            ]);
        }
    }
}
