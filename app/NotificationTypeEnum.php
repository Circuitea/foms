<?php

namespace App;

enum NotificationTypeEnum: string
{
    case TASK_ASSIGNED = 'task-assigned';
    case CONSUMABLE_ITEM_LOW = 'consumable-item-low';
    case PERSONNEL_EMERGENCY = 'personnel-emergency';
}
