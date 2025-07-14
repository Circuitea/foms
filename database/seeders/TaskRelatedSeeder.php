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
        TaskType::create(['name' => 'Emergency Response']);
        TaskType::create(['name' => 'Equipment Maintenance']);
        TaskType::create(['name' => 'Training']);
        TaskType::create(['name' => 'Assessment']);
        TaskType::create(['name' => 'Patrol']);

        TaskPriority::create(['name' => 'Low']);
        TaskPriority::create(['name' => 'Normal']);
        TaskPriority::create(['name' => 'High']);
        TaskPriority::create(['name' => 'Urgent']);
    }
}
