<?php

namespace App;

enum StatusEnum: string
{
    case AVAILABLE = 'available';
    case ASSIGNED = 'assigned';
    case ON_BREAK = 'on break';
    case ON_LEAVE = 'on leave';
    case EMERGENCY = 'emergency';

    public function label(): string
    {
        return match($this) {
            static::AVAILABLE => 'Available',
            static::ASSIGNED => 'Assigned Task',
            static::ON_BREAK => 'On Break',
            static::ON_LEAVE => 'On Leave',
            static::EMERGENCY => 'In Emergency',
        };
    }
}
