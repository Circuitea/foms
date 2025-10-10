<?php
// tests/Feature/TasksTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('admin can access tasks list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::ADMIN ]);

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(200);
});

test('admin can access new task form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::ADMIN ]);

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(200);
});

test('operator can access tasks list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::OPERATOR ]);

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(200);
});

test('operator can access new task form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::OPERATOR ]);

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(200);
});

test('logistic staff cannot access tasks list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::LOGISTIC ]);

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(403);
});

test('logistic staff cannot access new task form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::LOGISTIC ]);

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(403);
});

test('it staff cannot access tasks list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::IT ]);

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(403);
});

test('it staff cannot access new task form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::IT ]);

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(403);
});

test('personnel cannot access tasks list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::PERSONNEL ]);

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(403);
});

test('personnel cannot access new task form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([ RolesEnum::PERSONNEL ]);

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(403);
});

test('guest cannot access task routes', function () {
    $response = $this->get('/tasks');
    $response->assertRedirect('/');

    $response = $this->get('/tasks/new');
    $response->assertRedirect('/');
});