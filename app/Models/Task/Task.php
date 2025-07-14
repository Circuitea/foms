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
