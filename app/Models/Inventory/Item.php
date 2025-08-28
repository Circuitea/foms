<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string|null $image_path
 * @property int $type_id
 * @property string $location
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inventory\TransactionEntry> $transactionEntries
 * @property-read int|null $transaction_entries_count
 * @property-read \App\Models\Inventory\ItemType $type
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereImagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Item whereTypeId($value)
 * @mixin \Eloquent
 */
class Item extends Model
{
    protected $table = 'inventory_items';
    public $timestamps = false;
    
    protected $fillable = ['name', 'description', 'location', 'image_path'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(ItemType::class, 'type_id');
    }

    public function transactionEntries(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'item_id');
    }
    
}
