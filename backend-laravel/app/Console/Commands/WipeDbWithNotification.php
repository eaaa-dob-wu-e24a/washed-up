<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class WipeDbWithNotification extends Command
{
    protected $signature = 'db:nuke';
    protected $description = 'Wipe the database and delete all Clerk users';

    public function handle()
    {
        // Call the original db:wipe command
        $this->call('db:wipe');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('CLERK_API_KEY'),
        ])->get('https://api.clerk.com/v1/users?limit=500&offset=0&order_by=-created_at');

        if ($response->successful()) {
            $users = $response->json();
            
            foreach ($users as $user) {
                $userId = $user['id'];
                
                // Delete each user from Clerk
                $deleteResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('CLERK_API_KEY'),
                ])->delete("https://api.clerk.com/v1/users/{$userId}");

                if (!$deleteResponse->successful()) {
                    $this->warn("Failed to delete user {$userId}: " . $deleteResponse->body());
                }
            }
            
            $this->info('Database wiped and users deleted successfully');
        } else {
            $this->error('Database wiped but failed to fetch users: ' . $response->body());
        }
    }
}