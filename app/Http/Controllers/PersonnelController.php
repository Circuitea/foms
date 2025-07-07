<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewPersonnelRequest;
use App\Models\Personnel;
use App\Models\Section;
use App\PermissionsEnum;
use App\RolesEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class PersonnelController extends Controller
{
  public function list() {
    Gate::authorize(PermissionsEnum::PERSONNEL_READ);

    return Inertia::render('Personnel/ListPersonnel', [
      'personnel' => fn () => Personnel::with(['sections', 'roles'])->simplePaginate(15),
      'roles' => Role::all()->keyBy('name')->map(fn (Role $role) => RolesEnum::from($role->name)->label()),
      'sections' => Section::all(['id', 'name']),
      'total' => Personnel::count(),
    ]);
  }

  public function new() {
    Gate::authorize(PermissionsEnum::PERSONNEL_CREATE);

    $roles = Role::all()->map(fn (Role $role) => [
      'id' => $role->id,
      'name' => RolesEnum::from($role->name)->label(),
    ]);
    $sections = Section::all(['id', 'name']);

    return Inertia::render('Personnel/NewPersonnel', [
      'roles' => $roles,
      'sections' => $sections,
    ]);
  }

  public function create(NewPersonnelRequest $request) {
    Gate::authorize(PermissionsEnum::PERSONNEL_CREATE);

    $validated = $request->validated();

    $personnel = Personnel::create([
      'first_name' => $validated['first_name'],
      'middle_name' => $request->input('middle_name', null),
      'surname' => $validated['surname'],
      'name_extension' => $request->input('name_extension', null),
      'email' => $validated['email'],
      'mobile_number' => $validated['mobile_number'],
      'password' => Hash::make($validated['password']),
      'profile_picture_filename' => $request->file('profile_picture')->store('profilePictures', 'public'),
    ]);

    $personnel->sections()->attach($validated['sections']);

    return redirect('/personnel');
  }
}