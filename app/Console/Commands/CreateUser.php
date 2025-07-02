<?php

namespace App\Console\Commands;

use App\Models\Personnel;
use App\RolesEnum;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Spatie\Permission\Models\Role;

use function Laravel\Prompts\error;
use function Laravel\Prompts\form;
use function Laravel\Prompts\info;
use function Laravel\Prompts\note;
use function Laravel\Prompts\outro;

class CreateUser extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:personnel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Personnel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $password = $this->secret('What is the user\'s password?');

        // $roleID = Role::firstWhere('name', 'IT Staff')->id;
        // $newUser = Personnel::create([
        //     'password' => Hash::make($password),
        //     ... $this->arguments(),
        // ]);
        // $newUser->roles()->attach($roleID);
        // $newUser->save();

        info('Creating a new Personnel.');

        note('Press CTRL+U to go back to the previous field.');

        $roles = Role::all()->map(fn (Role $role) => [
            'id' => $role->id,
            'name' => RolesEnum::from($role->name)->label(),
        ])
            ->pluck('name', 'id');

        $responses = form()
            ->text('First name?', name: 'first_name', required: true)
            ->text('Middle name?', name: 'middle_name')
            ->text('Surname?', name: 'surname', required: true)
            ->text('Name extension?', name: 'name_extension')
            ->text('Email address?', name: 'email', required: true, validate: ['email' => 'unique:'.Personnel::class])
            ->multiselect('Roles?', name: 'roles', options: $roles)
            ->password('Password?', name: 'password', required: true, validate: ['password' => Password::defaults()])
            ->submit();

        $personnel = Personnel::create([
            'first_name' => $responses['first_name'],
            'middle_name' => $responses['middle_name'],
            'surname' => $responses['surname'],
            'name_extension' => $responses['name_extension'],
            'email' => $responses['email'],
            'password' => Hash::make($responses['password']),
        ]);

        $personnel->save();
        
        outro('User ' . $responses['first_name'] . '(ID:' . $personnel->id . ') created.');
    }
}
