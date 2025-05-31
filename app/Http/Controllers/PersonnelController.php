<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewPersonnelRequest;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonnelController extends Controller
{
    public function list() {
        $personnel = Personnel::paginate(15);

        return Inertia::render('Personnel/ListPersonnel', [
            'personnel' => $personnel,
        ]);
    }

    public function new() {
        return Inertia::render('Personnel/NewPersonnel');
    }

    public function create(NewPersonnelRequest $request) {
        $validated = $request->validated();

        Personnel::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'surname' => $validated['surname'],
            'name_extension' => $validated['name_extension'],
            'email' => $validated['email'],
            'mobile_number' => $validated['mobile_number'],
            'password' => Hash::make($validated['password'],),
        ]);

        return redirect('/personnel');
    }
}
