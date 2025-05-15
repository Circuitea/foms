<?php

namespace Database\Seeders;

use App\Models\Personnel;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Personnel::factory(10)->create();

        Personnel::factory()->create([
            'first_name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
