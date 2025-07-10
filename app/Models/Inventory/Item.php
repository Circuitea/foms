<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $table = 'inventory_items';
    public $timestamps = false;
    
    protected $fillable = ['name', 'description', 'imagePath'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'type_id');
    }

    public function transactionEntries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'item_id');
    }
}
