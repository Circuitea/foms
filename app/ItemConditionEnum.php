<?php

namespace App;

enum ItemConditionEnum: string
{
    case AVAILABLE = 'available';
    case DEPLOYED = 'deployed';
    case IN_MAINTENANCE = 'in_maintenance';

    public function label(): string
    {
        return match($this) {
            static::AVAILABLE => 'Available',
            static::DEPLOYED => 'Deployed',
            static::IN_MAINTENANCE => 'In Maintenance',
        };
    }
}
