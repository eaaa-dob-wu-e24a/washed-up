<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            UserSeeder::class,
            MachineSeeder::class,
            QRCodeSeeder::class,
            CreditSeeder::class,
            CreditUsageSeeder::class,
            ScheduleSeeder::class,
        ]);
    }
}
