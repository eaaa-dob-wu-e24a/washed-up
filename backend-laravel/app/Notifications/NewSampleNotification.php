<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use YieldStudio\LaravelExpoNotifier\ExpoNotificationsChannel;
use YieldStudio\LaravelExpoNotifier\Dto\ExpoMessage;

class NewSampleNotification extends Notification
{
    private $title;
    private $body;

    public function __construct($title = null, $body = null)
    {
        $this->title = $title;
        $this->body = $body;
    }

    public function via($notifiable): array
    {
        return [ExpoNotificationsChannel::class];
    }

    public function toExpoNotification($notifiable): ExpoMessage
    {
        if (!$notifiable->expoTokens) {
            throw new \Exception('User does not have an Expo token registered');
        }

        $tokens = $notifiable->expoTokens->pluck('value')->toArray();

        return (new ExpoMessage())
            ->to($tokens)
            ->title($this->title)
            ->body($this->body)
            ->channelId('default');
    }
}
