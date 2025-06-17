<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class GoogleMeeting extends Model
{
    protected $fillable = ['meeting_link'];

    public function meeting(): MorphOne
    {
        return $this->morphOne(Meeting::class, 'format', 'format_type', 'format_id');
    }
}
