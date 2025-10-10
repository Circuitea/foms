<?php
// tests/Feature/InventoryTest.php

use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\EquipmentGroup;
use App\Models\Inventory\EquipmentItem;
use App\Models\Inventory\ItemType;
use App\Models\Personnel;
use App\RolesEnum;
use Database\Seeders\InventoryItemTypeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
});

test('logistic staff can access inventory', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::LOGISTIC,
    ]);

    $response = $this->actingAs($user)->get('/inventory');

    $response->assertStatus(200);
});

test('logistic staff can view inventory list by type', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::LOGISTIC ]);

  $type = ItemType::first();

  $response = $this->actingAs($user)->get('/inventory/' . $type->id);

  $response->assertStatus(200);
});

test('logistic staff can view consumable item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::LOGISTIC ]);

  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(200);
});

test('logistic staff can view equipment item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::LOGISTIC ]);

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

  $response = $this->actingAs($user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(200);
});

test('admin can access inventory', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::ADMIN,
    ]);

    $response = $this->actingAs($user)->get('/inventory');

    $response->assertStatus(200);
});

test('admin can view inventory list by type', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::ADMIN ]);

  $type = ItemType::first();

  $response = $this->actingAs($user)->get('/inventory/' . $type->id);

  $response->assertStatus(200);
});

test('admin can view consumable item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::ADMIN ]);

  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(200);
});

test('admin can view equipment item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::ADMIN ]);

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

  $response = $this->actingAs($user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(200);
});

test('it staff cannot access inventory', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::IT,
    ]);

    $response = $this->actingAs($user)->get('/inventory');

    $response->assertStatus(403);
});

test('it staff cannot view inventory list by type', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::IT ]);

  $type = ItemType::first();

  $response = $this->actingAs($user)->get('/inventory/' . $type->id);

  $response->assertStatus(403);
});

test('it staff cannot view consumable item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::IT ]);

  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(403);
});

test('it staff cannot view equipment item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::IT ]);

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

  $response = $this->actingAs($user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(403);
});

test('operators cannot access inventory', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::OPERATOR,
    ]);

    $response = $this->actingAs($user)->get('/inventory');

    $response->assertStatus(403);
});

test('operators cannot view inventory list by type', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::OPERATOR ]);

  $type = ItemType::first();

  $response = $this->actingAs($user)->get('/inventory/' . $type->id);

  $response->assertStatus(403);
});

test('operators cannot view consumable item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::OPERATOR ]);

  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(403);
});

test('operators cannot view equipment item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::OPERATOR ]);

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

  $response = $this->actingAs($user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(403);
});

test('personnel cannot access inventory', function () {
    $user = Personnel::factory()->create();
    $this->seed(RoleSeeder::class);
    $user->assignRole([
      RolesEnum::PERSONNEL,
    ]);

    $response = $this->actingAs($user)->get('/inventory');

    $response->assertStatus(403);
});

test('personnel cannot view inventory list by type', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::PERSONNEL ]);

  $type = ItemType::first();

  $response = $this->actingAs($user)->get('/inventory/' . $type->id);

  $response->assertStatus(403);
});

test('personnel cannot view consumable item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::PERSONNEL ]);

  $type = ItemType::first();

  $item = ConsumableItem::create([
    'name' => 'Test Item',
    'description' => 'Test Item',
    'type_id' => $type->id,
  ]);

  $response = $this->actingAs($user)->get('/inventory/consumable/' . $item->id);

  $response->assertStatus(403);
});

test('personnel cannot view equipment item details', function () {
  $user = Personnel::factory()->create();
  $this->seed([RoleSeeder::class, InventoryItemTypeSeeder::class]);

  $user->assignRole([ RolesEnum::PERSONNEL ]);

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

  $response = $this->actingAs($user)->get('/inventory/equipment/' . $item->id);

  $response->assertStatus(403);
});

test('guest cannot access inventory', function () {
    $response = $this->get('/inventory');

    $response->assertRedirect('/');
});