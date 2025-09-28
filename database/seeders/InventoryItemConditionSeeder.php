<?php

namespace Database\Seeders;

use App\ItemConditionEnum;
use App\Models\Inventory\ItemCondition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventoryItemConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect(ItemConditionEnum::cases())->each(function (ItemConditionEnum $condition) {
            ItemCondition::create([
                'name' => $condition->value,
            ]);
        });
    }
}
