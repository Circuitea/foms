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

test('admin can access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
        RolesEnum::IT,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel');
    
    $response->assertStatus(200);
});

test('admin can view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");
    
    $response->assertStatus(200);
});

test('admin cannot access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::ADMIN,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel/new');
    
    $response->assertStatus(403);
});

test('it staff can access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::IT,
    ]);

    $response = $this->actingAs($user)->get('/personnel');

    $response->assertStatus(200);
});

test('it staff can view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::IT,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");
    
    $response->assertStatus(200);
});

test('it staff can access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::IT,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel/new');
    
    $response->assertStatus(200);
});

test('logistic staff cannot access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::LOGISTIC,
    ]);

    $response = $this->actingAs($user)->get('/personnel');

    $response->assertStatus(403);
});

test('logistic staff cannot view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::LOGISTIC,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");
    
    $response->assertStatus(403);
});

test('logistic staff cannot access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::LOGISTIC,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel/new');
    
    $response->assertStatus(403);
});

test('field operators cannot access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::OPERATOR,
    ]);

    $response = $this->actingAs($user)->get('/personnel');

    $response->assertStatus(403);
});

test('field operators cannot view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::OPERATOR,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");
    
    $response->assertStatus(403);
});

test('field operators cannot access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::OPERATOR,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel/new');
    
    $response->assertStatus(403);
});

test('personnel cannot access personnel list', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/personnel');

    $response->assertStatus(403);
});

test('personnel cannot view personnel details', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::PERSONNEL,
    ]);
    
    $personnel = Personnel::factory()->create();
    $response = $this->actingAs($user)->get("/personnel/{$personnel->id}");
    
    $response->assertStatus(403);
});

test('personnel cannot access new personnel form', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
        RolesEnum::PERSONNEL,
    ]);
    
    $response = $this->actingAs($user)->get('/personnel/new');
    
    $response->assertStatus(403);
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
