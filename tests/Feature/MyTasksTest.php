<?php
// tests/Feature/MyTasksTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('authenticated user can access my tasks', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/my-tasks');

    $response->assertStatus(200);
});

test('guest cannot access my tasks', function () {
    $response = $this->get('/my-tasks');

    $response->assertRedirect('/');
});