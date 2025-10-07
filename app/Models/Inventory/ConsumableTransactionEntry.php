<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
