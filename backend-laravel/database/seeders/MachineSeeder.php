<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Machine;

class MachineSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run() {
        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 10; $i++) {
            Machine::create([
                'model' => $faker->sentence,
                'location' => $faker->sentence,
                'status' => $faker->boolean,
            ]);
        }
    }
}
