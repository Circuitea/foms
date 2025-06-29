<?php

namespace App\Console\Commands;

use App\Models\Role;
use Illuminate\Console\Command;

use function Laravel\Prompts\info;
use function Laravel\Prompts\outro;
use function Laravel\Prompts\text;

class CreateRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:role';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // info('Creating a new Role.');

        // $name = text('Role name?', required: true);

        // $role = Role::create([
        //     'name' => $name,
        // ]);

        // outro('Role ' . $role->name . ' (ID:' . $role->id . ') created.');
    }
}
