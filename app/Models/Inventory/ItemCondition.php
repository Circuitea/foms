<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemCondition extends Model
{
    protected $table = 'inventory_item_conditions';
    public $timestamps = false;

    protected $fillable = ['name'];

    public function transactionEntries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'condition_id');
    }
}
