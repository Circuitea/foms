<?php
// tests/Feature/TasksTest.php

use App\Models\Personnel;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('authenticated user can access tasks list', function () {
    $user = Personnel::factory()->create();

    $response = $this->actingAs($user)->get('/tasks');

    $response->assertStatus(200);
});

test('authenticated user can access new task form', function () {
    $user = Personnel::factory()->create();

    $response = $this->actingAs($user)->get('/tasks/new');

    $response->assertStatus(200);
});

test('guest cannot access task routes', function () {
    $response = $this->get('/tasks');
    $response->assertRedirect('/');

    $response = $this->get('/tasks/new');
    $response->assertRedirect('/');
});