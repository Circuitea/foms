<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumableTransactionEntry extends Model
{
  public $timestamps = false;

  public function item(): BelongsTo
  {
    return $this->belongsTo(ConsumableItem::class, 'item_id');
  }
}
