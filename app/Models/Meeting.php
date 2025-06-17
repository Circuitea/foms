<?php

namespace App\Models;

use App\MeetingPriority;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Meeting extends Model
{
    protected $fillable = [
        'title',
        'priority',
        'description',
        'schedule',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'priority' => MeetingPriority::class,
        ];
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(MeetingType::class, 'type_id');
    }

    public function department(): BelongsTo
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


}
