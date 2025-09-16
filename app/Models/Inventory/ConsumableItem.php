<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConsumableItem extends Model
{
    protected $fillable = ['name', 'description', 'location', 'image_path'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'type_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(ConsumableTransactionEntry::class, 'item_id');
    }
}
