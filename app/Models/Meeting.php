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
