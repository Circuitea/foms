<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemType extends Model
{
    protected $table = 'inventory_item_types';
    public $timestamps = false;

    protected $fillable = ['name', 'icon'];

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'type_id');
    }
}
