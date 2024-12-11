<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Location;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $locations = Location::all();

        // Create 50 users
        foreach (range(1, 50) as $index) {
            User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Default password for all test users
                'remember_token' => Str::random(10),
                'location_id' => $locations->random()->id, // Assign random location
                'role' => 'user'
            ]);
        }

        // Create one admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'location_id' => $locations->first()->id,
            'role' => 'admin'
        ]);
    }
}
