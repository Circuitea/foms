<?php

namespace Database\Seeders;

use App\Models\MeetingType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MeetingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MeetingType::create(['name' => 'Team Meeting']);
        MeetingType::create(['name' => 'Training Session']);
        MeetingType::create(['name' => 'Planning Meeting']);
        MeetingType::create(['name' => 'Emergency Briefing']);
        MeetingType::create(['name' => 'Drill Exercise']);
    }
}
