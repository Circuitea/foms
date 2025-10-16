<?php

namespace App\Models;

use App\Models\Task\TaskType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Incident extends Model
{
    public $timestamps = false;
    
    protected $fillable = ['barangay_id', 'type_id', 'year', 'month'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(TaskType::class, 'type_id');
    }

    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }
}
