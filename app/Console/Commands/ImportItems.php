<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Inventory\EquipmentItem;
use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\ItemType;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class ImportItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-items';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import equipment and consumable items from a CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        info('Place your CSV file in storage/app/private.');

        $fileName = text(
            label: 'CSV file name',
            placeholder: 'inventory_items.csv',
        );

        $groupIDOffset = text(
            label: 'Group ID Offset',
            placeholder: '0',
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
        $progress = progress(label: 'Importing Inventory Items', steps: count($lines));
        $progress->start();

        DB::transaction(function () use ($lines, $header, $progress, $groupIDOffset) {
            foreach ($lines as $line) {
                $data = array_combine($header, str_getcsv($line));
                $progress->hint('Adding: "' . $data['name'] . '"');

                foreach ($data as $key => $value) {
                    $data[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8,ISO-8859-1');
                }

                // Validate type
                if ((int)$data['is_consumable'] === 1) {
                    // Validate type for consumables only
                    $type = ItemType::find($data['type_id']);
                    if (!$type) {
                        warning("Skipping consumable item '{$data['name']}' (invalid type id: {$data['type']})");
                        $progress->advance();
                        continue;
                    }

                    ConsumableItem::create([
                        'name' => $data['name'],
                        'type_id' => $data['type_id'],
                        'description' => $data['description'],
                        'model_identifier' => $data['model_identifier'],
                    ]);
                } else {
                    // Equipment: disregard type_id
                    EquipmentItem::create([
                        'name' => $data['name'],
                        'group_id' => (int) $data['group_id'] + (int) $groupIDOffset,
                        'description' => $data['description'],
                    ]);
                }

                $progress->advance();
            }
            $progress->finish();
        });

        info('Import complete.');
    }
}
