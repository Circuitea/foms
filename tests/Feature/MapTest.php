<?php
// tests/Feature/MapTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('admin user can access map', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::ADMIN,
    ]);

    $response = $this->actingAs($user)->get('/map');

    $response->assertStatus(200);
});

test('field operator user can access map', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::OPERATOR,
    ]);

    $response = $this->actingAs($user)->get('/map');

    $response->assertStatus(200);
});

test('it staff user cannot access map', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::IT,
    ]);

    $response = $this->actingAs($user)->get('/map');

    $response->assertStatus(403);
});

test('logistics staff user cannot access map', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::IT,
    ]);

    $response = $this->actingAs($user)->get('/map');

    $response->assertStatus(403);
});

test('personnel cannot access map', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::IT,
    ]);

    $response = $this->actingAs($user)->get('/map');

    $response->assertStatus(403);
});



test('guest cannot access map routes', function () {
    $response = $this->get('/map');
    $response->assertRedirect('/');
});