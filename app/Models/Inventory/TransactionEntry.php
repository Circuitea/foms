<?php

namespace App\Models\Inventory;

use App\Models\Task\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $transaction_id
 * @property int $item_id
 * @property int $condition_id
 * @property int $amount
 * @property int|null $task_id
 * @property-read \App\Models\Inventory\ItemCondition $condition
 * @property-read \App\Models\Inventory\Item $item
 * @property-read Task|null $task
 * @property-read \App\Models\Inventory\Transaction $transaction
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereConditionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereTaskId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TransactionEntry whereTransactionId($value)
 * @mixin \Eloquent
 */
class TransactionEntry extends Model
{
    protected $table = 'inventory_transaction_entries';
    public $timestamps = false;

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(ItemCondition::class, 'condition_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
