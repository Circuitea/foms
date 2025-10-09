<?php
// tests/Feature/MeetingsTest.php

use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('authenticated user can access meetings list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::PERSONNEL,
        RolesEnum::IT,
        RolesEnum::LOGISTIC,
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/meetings');

    $response->assertStatus(200);
});

test('authenticated user can access new meeting form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::PERSONNEL,
        RolesEnum::IT,
        RolesEnum::LOGISTIC,
        RolesEnum::PERSONNEL,
    ]);
    $response = $this->actingAs($user)->get('/meetings/new');
    
    $response->assertStatus(200);
});

test('guest cannot access meeting routes', function () {
    $response = $this->get('/meetings');
    $response->assertRedirect('/');

    $response = $this->get('/meetings/new');
    $response->assertRedirect('/');
});