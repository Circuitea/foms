<?php

namespace App;

enum Status: string
{
    case AVAILABLE = 'available';
    case ASSIGNED = 'assigned';
    case ON_LEAVE = 'on leave';
    case EMERGENCY = 'emergency';

    public function label(): string
    {
        return match($this) {
            static::AVAILABLE => 'Available',
            static::ASSIGNED => 'Assigned Task',
            static::ON_LEAVE => 'On Leave',
            static::EMERGENCY => 'In Emergency',
        };
    }
}
