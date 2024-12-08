<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\NewSampleNotification;
use Illuminate\Console\Command;

class TestExpoNotification extends Command
{
    protected $signature = 'notification:test {user_id?}';
    protected $description = 'Test Expo notification';

    public function handle()
    {
        $userId = $this->argument('user_id') ?? 1;

        if (!$userId) {
            $this->error('User not found!');
            return;
        }

        $user = User::find($userId);
        if (!$user) {
            $this->error('User not found!');
            return;
        }

        if (!$user->expoTokens()->exists()) {
            $this->error('User does not have an Expo push token!');
            return;
        }

        $user->notify(new NewSampleNotification());

        $this->info('Notification sent to user ' . $userId);
    }
}
