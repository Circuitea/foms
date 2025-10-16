<?php

namespace App\Notifications;

use App\Models\Inventory\ConsumableItem;
use App\NotificationTypeEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use YieldStudio\LaravelExpoNotifier\Dto\ExpoMessage;
use YieldStudio\LaravelExpoNotifier\ExpoNotificationsChannel;

class ConsumableItemLowNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        protected ConsumableItem $item,
        protected int $level,
    ) { }

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
        return NotificationTypeEnum::CONSUMABLE_ITEM_LOW->value;
    }

    public function broadcastType(): string
    {
        return 'broadcast.' . NotificationTypeEnum::CONSUMABLE_ITEM_LOW->value;
    }

    public function toExpoNotification($notifiable): ExpoMessage
    {
        $tokens = $notifiable->tokens->flatMap(function ($token) {
            return $token->expoTokens->pluck('value');
        })->toArray();

        $itemName = $this->item->name;
        $level = $this->level;

        return (new ExpoMessage())
            ->to($tokens)
            ->title("Item '$itemName' is low.")
            ->body("Consumable item $itemName's quantity is below the recommended level (< $level).")
            ->channelId('default');
            // ->shouldBatch()
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'item' => [
                'id' => $this->item->id,
                'name' => $this->item->name,
                'quantity' => $this->item->loadSum('entries as total', 'quantity')->total,
                'level' => $this->level,
            ],
        ];
    }
}
