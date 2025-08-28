<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property int $id
 * @property string $meeting_link
 * @property-read \App\Models\Meeting|null $meeting
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GoogleMeeting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GoogleMeeting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GoogleMeeting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GoogleMeeting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|GoogleMeeting whereMeetingLink($value)
 * @mixin \Eloquent
 */
class GoogleMeeting extends Model
{
    public $timestamps = false;
    protected $fillable = ['meeting_link'];

    public function meeting(): MorphOne
    {
        return $this->morphOne(Meeting::class, 'format', 'format_type', 'format_id');
    }
}
