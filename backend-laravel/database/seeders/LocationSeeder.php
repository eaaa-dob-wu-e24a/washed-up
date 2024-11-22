<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $faker = \Faker\Factory::create();
        for ($i = 0; $i < 10; $i++) {
            Location::create([
                'name' => $faker->city()
            ]);
        }
    }
}
