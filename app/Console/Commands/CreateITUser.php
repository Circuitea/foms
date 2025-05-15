<?php

namespace App\Console\Commands;

use App\Models\Personnel;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\Hash;

class CreateITUser extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-it-user {first_name} {surname} {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a User with the IT Role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $password = $this->secret('What is the user\'s password?');

        $roleID = Role::firstWhere('name', 'IT Staff')->id;
        $newUser = Personnel::create([
            'password' => Hash::make($password),
            ... $this->arguments(),
        ]);
        $newUser->roles()->attach($roleID);
        $newUser->save();
    }
}
