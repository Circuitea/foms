<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Incident;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

class ImportIncidents extends Command
{
    protected $signature = 'app:import-incidents';
    protected $description = 'Import incidents from a CSV file';

    public function handle()
    {
        info('Place your CSV file in storage/app/private.');

        $fileName = text(
            label: 'CSV file name',
            placeholder: 'incidents.csv',
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

        $progress = progress(label: 'Importing Incidents', steps: count($lines));
        $progress->start();

        DB::transaction(function () use ($lines, $header, $progress) {
            foreach ($lines as $line) {
                $data = array_combine($header, str_getcsv($line));

                $progress->hint('Processing barangay_id: ' . $data['barangay_id'] . ', type_id: ' . $data['type_id'] . ', year: ' . $data['year'] . ', month: ' . $data['month']);

                foreach ($data as $key => $value) {
                    $data[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8,ISO-8859-1');
                }

                Incident::create([
                    'barangay_id' => $data['barangay_id'],
                    'type_id' => $data['type_id'],
                    'year' => $data['year'],
                    'month' => $data['month'],
                ]);

                $progress->advance();
            }
            $progress->finish();
        });

        info('Import complete.');
    }
}