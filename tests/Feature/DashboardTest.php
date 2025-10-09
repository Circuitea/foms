<?php
// tests/Feature/DashboardTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('authenticated user can access dashboard', function () {
  $user = Personnel::factory()->create();
  
  $this->seed(RoleSeeder::class);
  $user->assignRole([
    RolesEnum::ADMIN,
    RolesEnum::PERSONNEL,
    RolesEnum::IT,
    RolesEnum::LOGISTIC,
    RolesEnum::PERSONNEL,
  ]);

  $response = $this->actingAs($user)->get('/dashboard');

  $response->assertStatus(200);
});

test('guest cannot access dashboard', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/');
});