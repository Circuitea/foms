<?php

namespace App;

enum Status: string
{
    case ACTIVE = 'active';
    case ON_DUTY = 'on duty';
    case ON_SITE = 'on site';
    case ON_LEAVE = 'on leave';
}
