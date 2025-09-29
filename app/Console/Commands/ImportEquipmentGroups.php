<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Inventory\EquipmentGroup;
use App\Models\Inventory\ItemType;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class ImportEquipmentGroups extends Command
{
    protected $signature = 'app:import-equipment-groups';
    protected $description = 'Import equipment groups from a CSV file';

    public function handle()
    {
        info('Place your CSV file in storage/app/private.');

        $groupIDOffset = EquipmentGroup::max('id'); // For importing items

        $fileName = text(
            label: 'CSV file name',
            placeholder: 'equipment_groups.csv',
        );

        $filePath = storage_path("app/private/{$fileName}");

        if (!file_exists($filePath)) {
            error("File not found: {$filePath}");
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines || count($lines) < 2) {
            error("CSV file is empty or missing data.");
            return;
        }

        $header = str_getcsv(array_shift($lines));
        $progress = progress(label: 'Importing Equipment Groups', steps: count($lines));
        $progress->start();

        DB::transaction(function () use ($lines, $header, $progress) {
            foreach ($lines as $line) {
                $data = array_combine($header, str_getcsv($line));

                // Validate type
                $type = ItemType::find($data['type_id']);
                if (!$type) {
                    warning("Skipping group '{$data['name']}' (invalid type id: {$data['type_id']})");
                    $progress->advance();
                    continue;
                }

                EquipmentGroup::create([
                    'name' => $data['name'],
                    'type_id' => $data['type_id'],
                ]);

                $progress->advance();
            }
            $progress->finish();
        });

        info('Import complete.');
        info('Set Group ID offset to "' . $groupIDOffset . '"');
    }
}