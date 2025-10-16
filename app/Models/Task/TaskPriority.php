<?php

namespace App\Models\Task;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskPriority newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskPriority newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskPriority query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskPriority whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskPriority whereName($value)
 * @mixin \Eloquent
 */
class TaskPriority extends Model
{
    protected $table = 'task_priorities';

    protected $fillable = ['id', 'name'];

    public $timestamps = false;

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'priority_id');
    }
}
