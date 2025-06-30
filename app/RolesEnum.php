<?php

namespace App;

enum RolesEnum: string
{
    case ADMIN = 'admin';
    case OPERATOR = 'operator';
    case LOGISTIC = 'logistic';
    case IT = 'it';
    case PERSONNEL = 'personnel';

    public function label(): string
    {
        return match($this) {
            static::ADMIN => 'Administrative Staff Member',
            static::OPERATOR => 'Field Operations Manager / Leader',
            static::LOGISTIC => 'Logistics Department Staff Member',
            static::IT => 'IT Department Staff Member',
            static::PERSONNEL => 'Personnel',
        };
    }
}
