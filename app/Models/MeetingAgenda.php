<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order
 * @property string $agenda
 * @property int $meeting_id
 * @property-read \App\Models\Meeting $meeting
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda whereAgenda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda whereMeetingId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingAgenda whereOrder($value)
 * @mixin \Eloquent
 */
class MeetingAgenda extends Model
{
    public $timestamps = false;
    protected $fillable = ['order', 'agenda'];

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class, 'meeting_id');
    }
}
