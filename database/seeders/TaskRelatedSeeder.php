<?php

namespace Database\Seeders;

use App\Models\Task\TaskPriority;
use App\Models\Task\TaskType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskRelatedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskType::upsert([
            ['id' => 1, 'name' => 'Emergency Response'],
            ['id' => 2, 'name' => 'Equipment Maintenance'],
            ['id' => 3, 'name' => 'Training'],
            ['id' => 4, 'name' => 'Assessment'],
            ['id' => 5, 'name' => 'Patrol'],
            ['id' => 6, 'name' => 'Patient Transport Vehicle'],
            ['id' => 7, 'name' => 'Flood Response'],
            ['id' => 8, 'name' => 'Earthquake Response'],
            ['id' => 9, 'name' => 'Vehicular Accident Response'],
            ['id' => 10, 'name' => 'Accident Response'],
            ['id' => 11, 'name' => 'Medical Response'],
            ['id' => 12, 'name' => 'Equipment Procurement'],
            ['id' => 13, 'name' => 'System Account Creation'],
        ], uniqueBy: ['id'], update: ['name']);

        TaskPriority::upsert([
            ['id' => 1, 'name' => 'Low'],
            ['id' => 2, 'name' => 'Normal'],
            ['id' => 3, 'name' => 'High'],
            ['id' => 4, 'name' => 'Urgent'],
        ], uniqueBy: ['id'], update: ['name']);
    }
}
