<?php

use App\Models\Personnel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

pest()->use(RefreshDatabase::class);

test('user can access login page', function () {
  $response = $this->get(route('login'));
  $response->assertStatus(200);
});

test('user can login with valid credentials', function () {
  $user = Personnel::factory()->create([
    'password' => Hash::make('password'),
  ]);

  $response = $this->post('/login', [
    'email' => $user->email,
    'password' => 'password',
  ]);

  $response->assertRedirect();
  $this->assertAuthenticatedAs($user);
});

test('user cannnot login without valid credentials', function () {
  $user = Personnel::factory()->create([
    'password' => Hash::make('password'),
  ]);

  $response = $this->post('/login', [
    'email' => $user->email,
    'password' => 'wrong-password',
  ]);

  $response->assertSessionHasErrors();
  $this->assertGuest();
});
