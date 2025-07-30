<?php

namespace App\Models\Inventory;

use App\ItemConditionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemCondition extends Model
{
    protected $table = 'inventory_item_conditions';
    public $timestamps = false;

    protected $fillable = ['name'];

    protected function casts(): array
    {
        return [
            'name' => ItemConditionEnum::class,
        ];
    }

    public function transactionEntries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'condition_id');
    }
}
