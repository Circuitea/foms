<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;

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

    public function create(Request $request) {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'surname' => 'required|string|max:255',
            'name_extension' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.Personnel::class,
            'mobile_number' => 'nullable|string|max:255',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        Personnel::create([
            'first_name' => $request->input('first_name'),
            'middle_name' => $request->input('middle_name'),
            'surname' => $request->input('surname'),
            'name_extension' => $request->input('name_extension'),
            'email' => $request->input('email'),
            'mobile_number' => $request->input('mobile_number'),
            'password' => Hash::make($request->input('password')),
        ]);

        return redirect('/personnel');
    }
}
