<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentTransactionEntry extends Model
{
  public $timestamps = false;

  public function item(): BelongsTo
  {
    return $this->belongsTo(EquipmentItem::class, 'item_id');
  }

  public function transaction(): BelongsTo
  {
    return $this->belongsTo(Transaction::class, 'transaction_id');
  }
}
