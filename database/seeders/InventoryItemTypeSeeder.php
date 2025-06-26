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
        ItemType::create(['name' => 'Logistic Equipment']);
        ItemType::create(['name' => 'Medical Equipment']);
        ItemType::create(['name' => 'Office Equipment']);
        ItemType::create(['name' => 'Rescue Equipment']);
    }
}
