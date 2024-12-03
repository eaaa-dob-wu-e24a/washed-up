<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ListUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:list {--role= : Filter users by role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all registered users in the system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = User::query();

        // Filter by role if provided
        if ($role = $this->option('role')) {
            $query->where('role', $role);
        }

        $users = $query->get();

        if ($users->isEmpty()) {
            $this->info('No users found.');
            return;
        }

        $headers = ['ID', 'Name', 'Email', 'Created At', 'Role'];
        $rows = $users->map(function ($user) {
            return [
                $user->id,
                $user->name,
                $user->email,
                $user->created_at->format('Y-m-d H:i:s'),
                $user->role,
            ];
        });

        $this->table($headers, $rows);
    }
}
