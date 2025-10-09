<?php
// tests/Feature/PersonnelTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('authenticated user can access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::PERSONNEL,
        RolesEnum::IT,
        RolesEnum::LOGISTIC,
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/personnel');

    $response->assertStatus(200);
});

test('authenticated user can access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::PERSONNEL,
        RolesEnum::IT,
        RolesEnum::LOGISTIC,
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/personnel/new');

    $response->assertStatus(200);
});

test('authenticated user can access personnel import page', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::PERSONNEL,
        RolesEnum::IT,
        RolesEnum::LOGISTIC,
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/personnel/import');

    $response->assertStatus(200);
});

test('authenticated user can view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::ADMIN,
      RolesEnum::PERSONNEL,
      RolesEnum::IT,
      RolesEnum::LOGISTIC,
      RolesEnum::PERSONNEL,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");

    $response->assertStatus(200);
});

test('guest cannot access personnel routes', function () {
    $personnel = Personnel::factory()->create();

    $response = $this->get('/personnel');
    $response->assertRedirect('/');

    $response = $this->get('/personnel/new');
    $response->assertRedirect('/');

    $response = $this->get("/personnel/{$personnel->id}");
    $response->assertRedirect('/');
});