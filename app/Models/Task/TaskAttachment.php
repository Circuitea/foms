<?php

namespace App\Models\Task;

use Illuminate\Database\Eloquent\Model;

class TaskAttachment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'personnel_id',
        'task_id',
        'file_path',
        'file_name',
    ];
}
