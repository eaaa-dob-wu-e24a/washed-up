<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use YieldStudio\LaravelExpoNotifier\ExpoNotificationsChannel;
use YieldStudio\LaravelExpoNotifier\Dto\ExpoMessage;

class NewSampleNotification extends Notification
{
    private $customData;

    public function __construct($customData = null)
    {
        $this->customData = $customData;
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

        $token = $notifiable->expoTokens->value;

        return (new ExpoMessage())
            ->to([$token])
            ->title('A beautiful title')
            ->body('This is a content: ' . $this->customData)
            ->channelId('default');
    }
}
