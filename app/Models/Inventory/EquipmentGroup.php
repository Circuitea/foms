<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentGroup extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'type_id'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'type_id');
    }
    
    public function items(): HasMany
    {
        return $this->hasMany(EquipmentItem::class, 'group_id');
    }
}
