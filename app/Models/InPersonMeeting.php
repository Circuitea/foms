<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class InPersonMeeting extends Model
{
    public $timestamps = false;
    protected $fillable = ['meeting_location'];

    public function meeting(): MorphOne
    {
        return $this->morphOne(Meeting::class, 'format', 'format_type', 'format_id');
    }
}
