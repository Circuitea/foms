<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemType extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'icon'];

    public function consumables(): HasMany
    {
        return $this->hasMany(ConsumableItem::class, 'type_id');
    }

    public function equipmentGroups(): HasMany
    {
        return $this->hasMany(EquipmentGroup::class, 'type_id');
    }
}

