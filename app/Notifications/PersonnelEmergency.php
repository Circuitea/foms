<?php

namespace App\Notifications;

use App\Models\Personnel;
use App\NotificationTypeEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use YieldStudio\LaravelExpoNotifier\Dto\ExpoMessage;
use YieldStudio\LaravelExpoNotifier\ExpoNotificationsChannel;

class PersonnelEmergency extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected Personnel $person)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [ExpoNotificationsChannel::class, 'broadcast', 'database'];
    }

    public function databaseType(): string
    {
        return NotificationTypeEnum::PERSONNEL_EMERGENCY->value;
    }

    public function broadcastType(): string
    {
        return 'broadcast.' . NotificationTypeEnum::PERSONNEL_EMERGENCY->value;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'personnel' => $this->person,
        ];
    }

    public function toExpoNotification($notifiable): ExpoMessage
    {
        $tokens = $notifiable->tokens->flatMap(function ($token) {
            return $token->expoTokens->pluck('value');
        })->toArray();

        return (new ExpoMessage())
            ->to($tokens)
            ->title('Personnel ' . $this->person->first_name . ' is in an Emergency.')
            ->body('Personnel ' . $this->person->first_name . ' has set their status to Emergency.')
            ->channelId('default');
            // ->shouldBatch()
    }
}
