<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $icon
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inventory\Item> $items
 * @property-read int|null $items_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemType whereName($value)
 * @mixin \Eloquent
 */
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
