<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewPersonnelRequest;
use App\Models\Personnel;
use App\Models\Section;
use App\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class PersonnelController extends Controller
{
  public function list() {

    return Inertia::render('Personnel/ListPersonnel', [
      'personnel' => fn () => Personnel::with(['sections', 'roles'])->simplePaginate(15),
      'roles' => Role::all()->keyBy('name')->map(fn (Role $role) => RolesEnum::from($role->name)->label()),
      'sections' => Section::all(['id', 'name']),
      'total' => Personnel::count(),
    ]);
  }

  public function new() {
    $roles = Role::all();
    $sections = Section::all(['id', 'name']);

    return Inertia::render('Personnel/NewPersonnel', [
      'roles' => $roles,
      'sections' => $sections,
    ]);
  }

  public function create(NewPersonnelRequest $request) {
    $validated = $request->validated();

    $personnel = Personnel::create([
      'first_name' => $validated['first_name'],
      'middle_name' => $validated['middle_name'],
      'surname' => $validated['surname'],
      'name_extension' => $validated['name_extension'],
      'email' => $validated['email'],
      'mobile_number' => $validated['mobile_number'],
      'password' => Hash::make($validated['password'],),
    ]);

    $personnel->sections()->attach($validated['sections']);

    return redirect('/personnel');
  }
}