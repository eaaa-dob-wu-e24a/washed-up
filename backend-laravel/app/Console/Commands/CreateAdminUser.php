<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {name} {password} {location_id}';
    protected $description = 'Create a new admin user';

    public function handle()
    {
        try {
            $user = User::create([
                'name' => $this->argument('name'),
                'password' => Hash::make($this->argument('password')),
                'location_id' => $this->argument('location_id'),
                'role' => 'admin',
                'email' => strtolower(str_replace(' ', '.', $this->argument('name'))) . '@admin.com'
            ]);

            $this->info("Admin user '{$user->name}' created successfully!");
            $this->info("Email: {$user->email}");
        } catch (\Exception $e) {
            $this->error('Failed to create admin user: ' . $e->getMessage());
        }
    }
}