<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {user_id}';
    protected $description = 'Convert an existing user to admin';

    public function handle()
    {
        try {
            $user = User::findOrFail($this->argument('user_id'));
            $user->update([
                'role' => 'admin'
            ]);

            $this->info("User '{$user->name}' has been converted to admin successfully!");
            $this->info("Email: {$user->email}");
        } catch (\Exception $e) {
            $this->error('Failed to convert user to admin: ' . $e->getMessage());
        }
    }
}