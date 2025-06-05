<?php

namespace App\Console\Commands;

use App\Models\Personnel;
use App\Models\Section;
use Illuminate\Console\Command;

use function Laravel\Prompts\form;
use function Laravel\Prompts\info;
use function Laravel\Prompts\note;
use function Laravel\Prompts\outro;

class CreateSection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:section';

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
        info('Creating a new Section');

        note('Press CTRL+U to go back to the previous field.');

        $responses = form()
            ->text('Section Name?', name: 'name', required: true)
            ->search('Manager Personnel?', name: 'manager_id', required: true,
                options: function (string $val) {
                    return Personnel::whereLike('first_name', '%' . $val . '%')
                        ->get()
                        ->keyBy('id')
                        ->map(function (Personnel $personnel) {
                            return 'ID:' . $personnel->id . ' ' . $personnel->first_name . ' ' . $personnel->surname . ' (' . $personnel->email . ')';
                        })
                        ->toArray();
                },
            )
            ->submit();

        $section = Section::create([
            'name' => $responses['name'],
            'manager_id' => $responses['manager_id'],
        ]);

        outro('Section ' . $section->name . ' (ID:' . $section->id . ') created');

    }
}
