<?php

namespace App\Models;

use App\MeetingPriority;
use App\MeetingStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Date;

/**
 * @property int $id
 * @property string $title
 * @property int $type_id
 * @property int $section_id
 * @property MeetingPriority $priority
 * @property string $description
 * @property \Illuminate\Support\Carbon $schedule
 * @property int $duration
 * @property string $format_type
 * @property int $format_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $organizer_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\MeetingAgenda> $agendas
 * @property-read int|null $agendas_count
 * @property-read Model|\Eloquent $format
 * @property-read \App\Models\Personnel $organizer
 * @property-read \App\Models\Section $section
 * @property-read mixed $status
 * @property-read \App\Models\MeetingType $type
 * @method static Builder<static>|Meeting newModelQuery()
 * @method static Builder<static>|Meeting newQuery()
 * @method static Builder<static>|Meeting query()
 * @method static Builder<static>|Meeting whereCreatedAt($value)
 * @method static Builder<static>|Meeting whereDescription($value)
 * @method static Builder<static>|Meeting whereDuration($value)
 * @method static Builder<static>|Meeting whereFormatId($value)
 * @method static Builder<static>|Meeting whereFormatType($value)
 * @method static Builder<static>|Meeting whereId($value)
 * @method static Builder<static>|Meeting whereOrganizerId($value)
 * @method static Builder<static>|Meeting wherePriority($value)
 * @method static Builder<static>|Meeting whereSchedule($value)
 * @method static Builder<static>|Meeting whereSectionId($value)
 * @method static Builder<static>|Meeting whereTitle($value)
 * @method static Builder<static>|Meeting whereTypeId($value)
 * @method static Builder<static>|Meeting whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Meeting extends Model
{
    protected $fillable = [
        'title',
        'priority',
        'description',
        'schedule',
        'duration',
    ];

    protected $appends = ['status'];

    protected function casts(): array
    {
        return [
            'priority' => MeetingPriority::class,
            'schedule' => 'datetime'
        ];
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(MeetingType::class, 'type_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function format(): MorphTo
    {
        return $this->morphTo(__FUNCTION__, 'format_type', 'format_id');
    }

    public function agendas(): HasMany
    {
        return $this->hasMany(MeetingAgenda::class, 'meeting_id');
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'organizer_id');
    }
    
    protected function status(): Attribute
    {
        return Attribute::make(
            get: fn($_, mixed $attributes) => match(true) {
                $attributes['schedule'] > now() => MeetingStatus::ACTIVE,
                Date::parse($attributes['schedule'])->addMinutes($attributes['duration']) > now() => MeetingStatus::ONGOING,
                Date::parse($attributes['schedule']) < now() => MeetingStatus::FINISHED,
            },
        );
    }

}
