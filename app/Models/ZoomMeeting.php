<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property int $id
 * @property string $meeting_link
 * @property string $meeting_id
 * @property string|null $meeting_passcode
 * @property-read \App\Models\Meeting|null $meeting
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereMeetingLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereMeetingPasscode($value)
 * @mixin \Eloquent
 */
class ZoomMeeting extends Model
{
    public $timestamps = false;
    protected $fillable = ['meeting_link', 'meeting_id', 'meeting_passcode'];

    public function meeting(): MorphOne
    {
        return $this->morphOne(Meeting::class, 'format', 'format_type', 'format_id');
    }
}
