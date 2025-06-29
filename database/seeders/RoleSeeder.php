<?php

namespace Database\Seeders;

use App\PermissionsEnum;
use App\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

use function Laravel\Prompts\confirm;

class RoleSeeder extends Seeder
{
/**
 * Run the database seeds.
 */
  public function run(): void
  {
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    $mapToPermission = fn (PermissionsEnum $permission) => Permission::findOrCreate($permission->value);

    Role::findOrCreate(RolesEnum::PERSONNEL->value)->syncPermissions(collect([
      PermissionsEnum::INVENTORY_READ,
      PermissionsEnum::MAP_READ,
      PermissionsEnum::MEETINGS_READ_SELF,
      PermissionsEnum::NOTIFICATIONS_READ_SELF,
      PermissionsEnum::PERSONNEL_READ,
      PermissionsEnum::PERSONNEL_STATUS_UPDATE_SELF,
      PermissionsEnum::TASKS_CREATE,
      PermissionsEnum::TASKS_CREATE_EMERGENCY,
      PermissionsEnum::TASKS_READ_SELF,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::IT->value)->syncPermissions(collect([
      PermissionsEnum::PERSONNEL_ALL,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::LOGISTIC->value)->syncPermissions(collect([
      PermissionsEnum::INVENTORY_ALL,
    ])->map($mapToPermission));

    // if (app()->environment('production')) {
    //   return;
    // }
    
    // // $shouldCreateDummyAccounts = confirm(
    // //   label: 'Do you want to create dummy accounts?',
    // //   default: false,
    // //   yes: 'Yes',
    // //   no: 'No',
    // //   hint: 'Dummy accounts are only meant for development purposes.',
    // // );
  }
}
