<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class ZoomMeeting extends Model
{
    public $timestamps = false;
    protected $fillable = ['meeting_link', 'meeting_id', 'meeting_passcode'];

    public function meeting(): MorphOne
    {
        return $this->morphOne(Meeting::class, 'format', 'format_type', 'format_id');
    }
}
