<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionEntry extends Model
{
    protected $table = 'inventory_transaction_entries';
    public $timestamps = false;

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(ItemCondition::class, 'condition_id');
    }
}
