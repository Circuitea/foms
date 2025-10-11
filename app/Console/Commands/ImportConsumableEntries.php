<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\ConsumableTransactionEntry;
use App\Models\Inventory\Transaction;
use App\Models\Personnel;
use Illuminate\Support\Facades\Date;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\search;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class ImportConsumableEntries extends Command
{
    protected $signature = 'app:import-consumable-entries';
    protected $description = 'Import consumable transaction entries from a CSV file';

    public function handle()
    {
        info('Place your CSV file in storage/app/private.');

        $fileName = text(
            label: 'CSV file name',
            placeholder: 'consumable_entries.csv',
        );

        $personnelID = search(
            label: 'Personnel Account to use as the creator of the Transactions',
            options: fn (string $value) => strlen($value) > 0
                ? Personnel::whereLike('first_name', "%" . $value . "%")->pluck('first_name', 'id')->all()
                : [],
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

        $header[0] = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header[0]);

        $progress = progress(label: 'Importing Consumable Entries', steps: count($lines));
        $progress->start();

        DB::transaction(function () use ($lines, $header, $progress, $personnelID) {
            foreach ($lines as $line) {
                $data = array_combine($header, str_getcsv($line));

                $progress->hint('Processing item_id: ' . $data['item_id'] . ', qty: ' . $data['quantity']);

                foreach ($data as $key => $value) {
                    $data[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8,ISO-8859-1');
                }

                // Validate item
                $item = ConsumableItem::find($data['item_id']);
                if (!$item) {
                    warning("Skipping entry (invalid item_id: {$data['item_id']})");
                    $progress->advance();
                    continue;
                }

                // Find or create transaction for this date
                $transaction = Transaction::create([
                    'title' => 'Imported Transaction',
                    'description' => 'Imported via CSV',
                    'created_at' => Date::createFromFormat('m/d/Y', $data['created_at'])->startOfDay(),
                    'personnel_id' => $personnelID,
                ]);

                ConsumableTransactionEntry::create([
                    'item_id' => $item->id,
                    'transaction_id' => $transaction->id,
                    'quantity' => $data['quantity'],
                ]);

                $progress->advance();
            }
            $progress->finish();
        });

        info('Import complete.');
    }
}