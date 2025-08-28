<?php

namespace App\Models\Task;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PersonnelTask extends Pivot
{
    public $timestamps = false;

    protected $with = ['report'];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(TaskReport::class, 'task_report_id');
    }
    
}
