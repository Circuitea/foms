<?php

namespace App\Models\Inventory;

use App\ItemConditionEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property ItemConditionEnum $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inventory\TransactionEntry> $transactionEntries
 * @property-read int|null $transaction_entries_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCondition newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCondition newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCondition query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCondition whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ItemCondition whereName($value)
 * @mixin \Eloquent
 */
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
