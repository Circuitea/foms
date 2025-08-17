<?php

namespace App\Events;

use App\Models\Personnel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The user that this notification will be sent to.
     * 
     * @var \App\Models\Personnel
     */
    private $user;

    /**
     * The title of the notification.
     * 
     * @var string
     */
    public $title;

    /**
     * The message body of the notification.
     * 
     * @var string
     */
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Personnel $user, string $title, string $message)
    {
        $this->user = $user;
        $this->title = $title;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('notifications.'.$this->user->id),
        ];
    }
}
