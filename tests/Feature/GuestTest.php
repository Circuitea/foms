<?php

use App\Models\Personnel;

test('guest cannot access dashboard', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/');
});

test('guest cannot access map', function () {
    $response = $this->get('/map');
    $response->assertRedirect('/');
});

test('guest cannot access my tasks', function () {
    $response = $this->get('/my-tasks');

    $response->assertRedirect('/');
});

test('guest cannot access task routes', function () {
    $response = $this->get('/tasks');
    $response->assertRedirect('/');

    $response = $this->get('/tasks/new');
    $response->assertRedirect('/');
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

test('guest cannot access inventory', function () {
    $response = $this->get('/inventory');

    $response->assertRedirect('/');
});