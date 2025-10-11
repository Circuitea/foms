<?php

use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\EquipmentGroup;
use App\Models\Inventory\EquipmentItem;
use App\Models\Inventory\ItemType;
use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\InventoryItemTypeSeeder;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $this->user = Personnel::factory()->create();
  $this->user->assignRole([
    RolesEnum::LOGISTIC,
  ]);
});

test('logistic staff can access dashboard', function () {
  $response = $this->actingAs($this->user)->get('/dashboard');

  $response->assertStatus(200);
});

test('logistics staff user cannot access map', function () {
  $response = $this->actingAs($this->user)->get('/map');

  $response->assertStatus(403);
});

test('logistic staff can access my tasks', function () {
  $response = $this->actingAs($this->user)->get('/my-tasks');

  $response->assertStatus(200);
});

test('logistic staff cannot access new task form', function () {
  $response = $this->actingAs($this->user)->get('/tasks/new');

  $response->assertStatus(403);
});

test('logistic staff cannot access personnel list', function () {
  $response = $this->actingAs($this->user)->get('/personnel');

  $response->assertStatus(403);
});

test('logistic staff cannot view personnel details', function () {
  $personnel = Personnel::factory()->create();
  $response = $this->actingAs($this->user)->get("/personnel/{$personnel->id}");
  
  $response->assertStatus(403);
});

test('logistic staff cannot access new personnel form', function () {
  $response = $this->actingAs($this->user)->get('/personnel/new');
  
  $response->assertStatus(403);
});

test('logistic staff can access inventory', function () {
  $response = $this->actingAs($this->user)->get('/inventory');

  $response->assertStatus(200);
});

test('logistic staff can view inventory list by type', function () {
  $type = ItemType::first();

  $response = $this->actingAs($this->user)->get('/inventory/' . $type->id);

  $response->assertStatus(200);
});

test('logistic staff can view consumable item details', function () {
  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($this->user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(200);
});

test('logistic staff can view equipment item details', function () {
  $type = ItemType::first();
  $group = EquipmentGroup::create([
    'name' => 'Test Group',
    'type_id' => $type->id,
  ]);

  $item = EquipmentItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'group_id' => $group->id,
  ]);

  $response = $this->actingAs($this->user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(200);
});