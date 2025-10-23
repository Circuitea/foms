<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentItem extends Model
{
    public $fillable = ['name', 'description', 'location', 'image_path', 'group_id', 'created_at', 'use_before_maintenance', 'use_before_disposal', 'years_life_expectancy'];

    public function entries(): HasMany
    {
        return $this->hasMany(EquipmentTransactionEntry::class, 'item_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'group_id');
    }
}
