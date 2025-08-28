<?php

namespace App;

enum PermissionsEnum: string
{
  case PERSONNEL_CREATE = 'personnel.create';
  case PERSONNEL_READ = 'personnel.read';
  case PERSONNEL_UPDATE = 'personnel.update';
  case PERSONNEL_DELETE = 'personnel.delete';
  case PERSONNEL_DEPLOY = 'personnel.deploy';
  case PERSONNEL_DEPLOY_ALL = 'personnel.deploy.all';
  case PERSONNEL_STATUS_READ = 'personnel.status.read.';
  case PERSONNEL_STATUS_UPDATE = 'personnel.status.update';
  case PERSONNEL_STATUS_UPDATE_SELF = 'personnel.status.update.self';
  case PERSONNEL_STATUS_ALL = 'personnel.status.*';
  case PERSONNEL_ALL = 'personnel.*';

  case NOTIFICATIONS_CREATE = 'notifications.create';
  case NOTIFICATIONS_READ = 'notifications.read';
  case NOTIFICATIONS_READ_SELF = 'notifications.read.self';
  case NOTIFICATIONS_UPDATE = 'notifications.update';
  case NOTIFICATIONS_DELETE = 'notifications.delete';
  case NOTIFICATIONS_ALL = 'notifications.*';

  case MEETINGS_CREATE = 'meetings.create';
  case MEETINGS_READ = 'meetings.read';
  case MEETINGS_READ_SELF = 'meetings.read.self';
  case MEETINGS_UPDATE = 'meetings.update';
  case MEETINGS_DELETE = 'meetings.delete';
  case MEETINGS_ALL = 'meetings.*';
  
  case INVENTORY_CREATE = 'inventory.create';
  case INVENTORY_READ = 'inventory.read';
  case INVENTORY_UPDATE = 'inventory.update';
  case INVENTORY_DELETE = 'inventory.delete';
  case INVENTORY_DEPLOY = 'inventory.deploy';
  case INVENTORY_MAINTENANCE = 'inventory.maintenance';
  case INVENTORY_TRANSACTION_CREATE = 'inventory.transaction.create';
  case INVENTORY_TRANSACTION_READ = 'inventory.transaction.read';
  case INVENTORY_TRANSACTION_UPDATE = 'inventory.transaction.update';
  case INVENTORY_TRANSACTION_DELETE = 'inventory.transaction.delete';
  case INVENTORY_TRANSACTION_ALL = 'inventory.transaction.*';
  case INVENTORY_ALL = 'inventory.*';

  case TASKS_CREATE = 'tasks.create';
  case TASKS_CREATE_EMERGENCY = 'tasks.create.emergency';
  case TASKS_READ = 'tasks.read';
  case TASKS_READ_SELF = 'tasks.read.self';
  case TASKS_UPDATE = 'tasks.update';
  case TASKS_DELETE = 'tasks.delete';
  case TASKS_REPORT_READ = 'tasks.report.read';
  case TASKS_TEMPLATES_CREATE = 'tasks.templates.create';
  case TASKS_TEMPLATES_READ = 'tasks.templates.read';
  case TASKS_TEMPLATES_UPDATE = 'tasks.templates.update';
  case TASKS_TEMPLATES_DELETE = 'tasks.templates.delete';
  case TASKS_TEMPLATES_ALL = 'tasks.templates.*';
  case TASKS_ALL = 'tasks.*';
  
  case LOCATIONS_READ = 'locations.read';
  case LOCATIONS_UPDATE = 'locations.update';
  case LOCATIONS_REPORT_READ = 'locations.report.read';
  case LOCATIONS_ALL = 'locations.*';
  
  case MAP_READ = 'map.read';
  case MAP_PRESENTATION_READ = 'map.presentation.read';
  case MAP_ALL = 'map.*';



}
