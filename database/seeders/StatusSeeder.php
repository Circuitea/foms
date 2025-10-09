<?php

namespace Database\Seeders;

use App\Models\Status;
use App\StatusEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            foreach(StatusEnum::cases() as $status) {
                Status::firstOrCreate([
                    'id' => $status->value,
                    'label' => $status->label(),
                ]);
            }
            });
    }
}
