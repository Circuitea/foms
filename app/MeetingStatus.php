<?php

namespace App;

enum MeetingStatus: string
{
    case ACTIVE = 'Active';
    case ONGOING = 'Ongoing';
    case FINISHED = 'Finished';
}
