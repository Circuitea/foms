<?php

namespace App\Notifications;

use App\Models\Task\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use YieldStudio\LaravelExpoNotifier\Dto\ExpoMessage;
use YieldStudio\LaravelExpoNotifier\ExpoNotificationsChannel;

class TaskAssignedNotification extends Notification
{
    use Queueable;

    protected Task $task;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [ExpoNotificationsChannel::class, 'broadcast'];
    }

    public function toExpoNotification($notifiable): ExpoMessage
    {
        $tokens = $notifiable->tokens->flatMap(function ($token) {
            return $token->expoTokens->pluck('value');
        })->toArray(    );

        $taskTitle = $this->task->title;

        return (new ExpoMessage())
            ->to($tokens)
            ->title("New Task Assigned")
            ->body("You have been assigned to task '$taskTitle'.")
            ->channelId('default')
            ->jsonData([
                'url' => '/(home)/task/' . $this->task->id,
            ])
            ->shouldBatch();
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'task' => $this->task,
        ]);
    }



    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
