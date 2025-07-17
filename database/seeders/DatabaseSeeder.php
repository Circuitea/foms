<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Task\TaskType;
use Illuminate\Container\Attributes\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MeetingTypeSeeder::class,
            InventoryItemTypeSeeder::class,
            RoleSeeder::class,
            TaskRelatedSeeder::class,
        ]);

        // $allDiagnosis = ['141j231', '123'];

        // collect($allDiagnosis)->each(function ($diagnosis) {
        //     Diagnosis::create([
        //         'diagnosis_name' = > $diagnosis,
        //         'visible_to_roles' => ['physician', 'dentist', 'obstetrician-gynecologist'],
        //     ]);
        // });
        // collect($dentistDiagnosis)->each(function ($diagnosis) {
        //     Diagnosis::create([
        //         'diagnosis_name' = > $diagnosis,
        //         'visible_to_roles' => ['physician', 'dentist', 'obstetrician-gynecologist'],
        //     ]);
        // });
        // collect($midwifeDiagnosis)->each(function ($diagnosis) {
        //     Diagnosis::create([
        //         'diagnosis_name' = > $diagnosis,
        //         'visible_to_roles' => ['physician', 'dentist', 'obstetrician-gynecologist'],
        //     ]);
        // });
    }
}
