<?php

namespace App\Models\Task;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TaskType whereName($value)
 * @mixin \Eloquent
 */
class TaskType extends Model
{
    protected $table = 'task_types';

    protected $fillable = ['id', 'name'];

    public $timestamps = false;

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'type_id');
    }
}
