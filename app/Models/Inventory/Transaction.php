<?php

namespace App\Models\Inventory;

use App\Models\Personnel;
use App\Models\Task\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property int $personnel_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Personnel $personnel
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Inventory\TransactionEntry> $transactionEntries
 * @property-read int|null $transaction_entries_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction wherePersonnelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    protected $fillable = ['title', 'description', 'personnel_id', 'task_id'];

    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

    public function consumables(): HasMany
    {
        return $this->hasMany(ConsumableTransactionEntry::class, 'transaction_id');
    }

    public function equipment(): HasMany
    {
        return $this->hasMany(EquipmentTransactionEntry::class, 'transaction_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

}
