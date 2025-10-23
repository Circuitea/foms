<?php

namespace App\Notifications;

use App\Models\Inventory\EquipmentItem;
use App\NotificationTypeEnum;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EquipmentNeedMaintenance extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected EquipmentItem $item, protected int $transaction_count)
    {
        //
    }

    public function databaseType(): string
    {
        return NotificationTypeEnum::EQUIPMENT_MAINTENANCE->value;
    }

    public function broadcastType(): string
    {
        return 'broadcast.' . NotificationTypeEnum::EQUIPMENT_MAINTENANCE->value;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast', 'database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'item' => $this->item,
            'transaction_count' => $this->transaction_count,
        ];
    }
}
