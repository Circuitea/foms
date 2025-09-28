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
        ItemType::create(['name' => 'Logistic Items', 'icon' => '🚛']);
        ItemType::create(['name' => 'Medical Items', 'icon' => '🏥']);
        ItemType::create(['name' => 'Office Items', 'icon' => '🏢']);
        ItemType::create(['name' => 'Rescue Items', 'icon' => '👥']);
    }
}
