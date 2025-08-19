<?php

namespace App\Models\Task;

use App\Models\Inventory\TransactionEntry;
use App\Models\Personnel;
use App\TaskStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Date;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string $location
 * @property int $priority_id
 * @property int $type_id
 * @property int $creator_id
 * @property int $section_id
 * @property \Illuminate\Support\Carbon $due_date
 * @property int $duration
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Personnel $creator
 * @property-read \Illuminate\Database\Eloquent\Collection<int, TransactionEntry> $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Personnel> $personnel
 * @property-read int|null $personnel_count
 * @property-read \App\Models\Task\TaskPriority $priority
 * @property-read mixed $status
 * @property-read \App\Models\Task\TaskType $type
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task wherePriorityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereSectionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'location',
        'due_date',
        'duration',
    ];

    protected $appends = ['status'];

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
        ];
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(TaskType::class, 'type_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(TaskPriority::class, 'priority_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'creator_id');
    }

    public function personnel(): BelongsToMany
    {
        return $this->belongsToMany(Personnel::class, 'personnel_task');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionEntry::class, 'task_id');
    }

    public function status(): Attribute
    {
        return Attribute::make(
            get: fn($_, mixed $attributes) => match(true) {
                Date::parse($attributes['due_date']) > Date::now() => TaskStatus::ONGOING,
                Date::parse($attributes['due_date']) < Date::now() => TaskStatus::FINISHED,
            },
        );
    }

}
