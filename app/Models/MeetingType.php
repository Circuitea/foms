<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Meeting> $meetings
 * @property-read int|null $meetings_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|MeetingType whereName($value)
 * @mixin \Eloquent
 */
class MeetingType extends Model
{
    public $timestamps = false;
    protected $fillable = ['name'];

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'type_id');
    }
}
