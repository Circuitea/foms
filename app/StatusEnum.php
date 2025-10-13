<?php

namespace App;

enum StatusEnum: string
{
    case AVAILABLE = 'available';
    case ON_BREAK = 'on break';
    case UNAVAILABLE = 'unavailable';
    case EMERGENCY = 'emergency';

    public function label(): string
    {
        return match($this) {
            static::AVAILABLE => 'Available',
            static::ON_BREAK => 'On Break',
            static::UNAVAILABLE => 'Off Duty',
            static::EMERGENCY => 'In Emergency',
        };
    }
}
