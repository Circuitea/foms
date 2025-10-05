<?php

namespace App\Events;

use App\Http\Resources\PersonnelLocationResource;
use App\Models\PersonnelLocation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class LocationSynced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public mixed $locations;
    /**
     * Create a new event instance.
     */
    public function __construct(mixed $locations)
    {
        $this->locations = $locations->toResourceCollection();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('location'),
        ];
    }
}
