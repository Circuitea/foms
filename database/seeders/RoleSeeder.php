<?php

namespace Database\Seeders;

use App\Models\Personnel;
use App\PermissionsEnum;
use App\RolesEnum;
use Faker\Provider\ar_EG\Person;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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

    collect(PermissionsEnum::cases())->each(function (PermissionsEnum $permission) {
      Permission::findOrCreate($permission->value);
    });

    $mapToPermission = fn (PermissionsEnum $permission) => Permission::firstWhere('name', $permission->value);

    Role::findOrCreate(RolesEnum::PERSONNEL->value)->syncPermissions(collect([
      PermissionsEnum::MEETINGS_READ_SELF,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::IT->value)->syncPermissions(collect([
      PermissionsEnum::PERSONNEL_ALL,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::LOGISTIC->value)->syncPermissions(collect([
      PermissionsEnum::INVENTORY_ALL,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::OPERATOR->value)->syncPermissions(collect([
      PermissionsEnum::MAP_ALL,
      PermissionsEnum::TASKS_ALL,
      PermissionsEnum::MEETINGS_ALL,
    ])->map($mapToPermission));

    Role::findOrCreate(RolesEnum::ADMIN->value)->syncPermissions(collect([
      PermissionsEnum::MAP_ALL,
      PermissionsEnum::PERSONNEL_READ,
      PermissionsEnum::TASKS_ALL,
      PermissionsEnum::MEETINGS_ALL,
      PermissionsEnum::INVENTORY_ALL,
    ])->map($mapToPermission));

    if (!app()->environment('development')) return;
    
    $shouldCreateDummyAccounts = confirm(
      label: 'Do you want to create dummy accounts?',
      default: false,
      yes: 'Yes',
      no: 'No',
      hint: 'Dummy accounts are only meant for development purposes.',
    );

    if (!$shouldCreateDummyAccounts) return;

    $personnel = Personnel::create([
      'first_name' => 'Personnel',
      'surname' => 'Account',
      'email' => 'personnel@example.com',
      'password' => Hash::make('password'),
      'first_time_login' => false,
    ]);
    $itStaff = Personnel::create([
      'first_name' => 'IT Staff',
      'surname' => 'Account',
      'email' => 'itstaff@example.com',
      'password' => Hash::make('password'),
      'first_time_login' => false,
    ]);
    $logisticStaff = Personnel::create([
      'first_name' => 'Logistic Staff',
      'surname' => 'Account',
      'email' => 'logisticstaff@example.com',
      'password' => Hash::make('password'),
      'first_time_login' => false,
    ]);
    $operator = Personnel::create([
      'first_name' => 'Field Operators',
      'surname' => 'Account',
      'email' => 'operator@example.com',
      'password' => Hash::make('password'),
      'first_time_login' => false,
    ]);
    $admin = Personnel::create([
      'first_name' => 'Administrative Staff',
      'surname' => 'Account',
      'email' => 'admin@example.com',
      'password' => Hash::make('password'),
      'first_time_login' => false,
    ]);

    $personnel->syncRoles([RolesEnum::PERSONNEL]);
    $itStaff->syncRoles([RolesEnum::PERSONNEL, RolesEnum::IT]);
    $logisticStaff->syncRoles([RolesEnum::PERSONNEL, RolesEnum::LOGISTIC]);
    $operator->syncRoles([RolesEnum::PERSONNEL, RolesEnum::OPERATOR]);
    $admin->syncRoles([RolesEnum::PERSONNEL, RolesEnum::ADMIN]);
  }
}
