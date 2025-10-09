<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

pest()->use(RefreshDatabase::class);

test('personnel can access login page', function () {
  $response = $this->get(route('login'));
  $response->assertStatus(200);
});

test('personnel can login with valid credentials', function () {
  
});

