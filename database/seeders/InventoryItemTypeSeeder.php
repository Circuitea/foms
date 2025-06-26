<?php

namespace Database\Seeders;

use App\Models\Inventory\ItemType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventoryItemTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ItemType::create(['name' => 'Logistic Equipment', 'icon' => '🚛']);
        ItemType::create(['name' => 'Medical Equipment', 'icon' => '🏥']);
        ItemType::create(['name' => 'Office Equipment', 'icon' => '🏢']);
        ItemType::create(['name' => 'Rescue Equipment', 'icon' => '👥']);
    }
}
