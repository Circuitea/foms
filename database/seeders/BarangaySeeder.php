<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = [
            ['id' => 1, 'name' => 'Addition Hills'],
            ['id' => 2, 'name' => 'Balong-Bato'],
            ['id' => 3, 'name' => 'Batis'],
            ['id' => 4, 'name' => 'Corazon De Jesus'],
            ['id' => 5, 'name' => 'Ermitano'],
            ['id' => 6, 'name' => 'Greenhills'],
            ['id' => 7, 'name' => 'Isabelita'],
            ['id' => 8, 'name' => 'Kabayanan'],
            ['id' => 9, 'name' => 'Little Baguio'],
            ['id' => 10, 'name' => 'Maytunas'],
            ['id' => 11, 'name' => 'Onse'],
            ['id' => 12, 'name' => 'Pasadena'],
            ['id' => 13, 'name' => 'Pedro Cruz'],
            ['id' => 14, 'name' => 'Progreso'],
            ['id' => 15, 'name' => 'Rivera'],
            ['id' => 16, 'name' => 'Saint Joseph'],
            ['id' => 17, 'name' => 'Salapan'],
            ['id' => 18, 'name' => 'San Perfecto'],
            ['id' => 19, 'name' => 'Santa Lucia'],
            ['id' => 20, 'name' => 'St. Joseph'],
            ['id' => 21, 'name' => 'Tibagan'],
            ['id' => 22, 'name' => 'West Crame'],
        ];

        Barangay::upsert(
            $barangays,
            ['id'], // Unique by id
            ['name'] // Update name if id exists
        );
    }
}
