<?php

namespace App\Models\Inventory;

use App\Models\Personnel;
use App\Notifications\ConsumableItemLowNotification;
use App\RolesEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ConsumableTransactionEntry extends Model
{
  protected $fillable = ['item_id', 'transaction_id', 'quantity'];

  public $timestamps = false;

  public function item(): BelongsTo
  {
    return $this->belongsTo(ConsumableItem::class, 'item_id');
  }

  public function transaction(): BelongsTo
  {
    return $this->belongsTo(Transaction::class, 'transaction_id');
  }

  protected static function booted()
  {
    static::created(function (ConsumableTransactionEntry $entry) {
      $item = $entry->item;
      $currentTotal = $item->loadSum('entries as total', 'quantity')->total;

      $thirtyDaysAgo = now()->subDays(30);

      $consumed = ConsumableTransactionEntry::where('item_id', $item->id)
        ->where('quantity', '<', 0)
        ->whereHas('transaction', function ($query) use ($thirtyDaysAgo) {
          $query->where('created_at', '>=', $thirtyDaysAgo);
        })
        ->sum('quantity');

      if ($currentTotal < abs($consumed)) {
        $personnel = Personnel::all()
          ->filter(fn ($person) => $person->hasRole([RolesEnum::ADMIN, RolesEnum::LOGISTIC]));

        Notification::send(
          $personnel,
          new ConsumableItemLowNotification(
            $item, abs($consumed)
          )
        );
      }

      Log::info('consumed', [
        'consumed' => $consumed,
        'total' => $currentTotal,
      ]);
    });
  }
}
