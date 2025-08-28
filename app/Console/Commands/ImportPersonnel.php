<?php

namespace App\Console\Commands;

use App\Models\Personnel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\text;

class ImportPersonnel extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-personnel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        info('Place your Comma-separated Values (CSV) file in storage/app/private folder.');

        $fileName = text(
            label: 'File Name',
            placeholder: 'personnel.csv',
        );

        if (!Storage::has($fileName)) {
            error("File {$fileName} not found.");
        }

        if (($file = fopen('./storage/app/private/' . $fileName, 'r')) !== false) {
            DB::transaction(function () use ($file, $fileName) {
                $progress = progress(label: 'Importing Personnel', steps: count(file('./storage/app/private/' . $fileName)));
                $progress->start();
                while (($line = fgets($file)) !== false) {
                    $line = mb_convert_encoding($line, 'UTF-8', 'UTF-8,ISO-8859-1');

                    $data = str_getcsv($line, ',', '"');

                    if ($data[0] === 'Email') continue;

                    $person = Personnel::create([
                        'email' => $data[0],
                        'surname' => $data[1],
                        'first_name' => $data[2],
                        'middle_name' => $data[3],
                        'name_extension' => $data[4],
                        'position' => $data[6],
                        'password' => Hash::make('password'),
                    ]);

                    $person->syncRoles(explode(",", $data[7]));
                    $person->save();
                    $progress->advance();
                }
                $progress->finish();

            });
            fclose($file);
        }
    }
}
