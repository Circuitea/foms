<?php

namespace App;

enum TaskStatus: string
{
    case ONGOING = 'ongoing';
    case FINISHED = 'finished';
}
