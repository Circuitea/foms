<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewPersonnelRequest;
use App\Models\Personnel;
use App\Models\Section;
use App\PermissionsEnum;
use App\RolesEnum;
use App\Rules\ValidRole;
use App\Rules\ValidSection;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
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
      'profile_picture_filename' => $request->has('profile_picture') ? $request->file('profile_picture')->store('profilePictures', 'public') : null,
    ]);

    $personnel->sections()->attach($validated['sections']);

    return redirect('/personnel');
  }

  public function import() {
    Gate::authorize(PermissionsEnum::PERSONNEL_CREATE);
    
    return Inertia::render('Personnel/ImportPersonnel', [
      'roles' => Role::all()->keyBy('name')->map(fn (Role $role) => RolesEnum::from($role->name)->label()),
      'sections' => Section::all()->pluck('name', 'id'),
    ]);
  }

  public function add(Request $request) {
    Gate::authorize(PermissionsEnum::PERSONNEL_CREATE);

    $request->validate([
      'personnel' => 'required|list',
      'personnel.*.first_name' => 'required|string|regex:/^[A-Za-z\s]+$/|max:255',
      'personnel.*.middle_name' => 'nullable|string|regex:/^[A-Za-z\s]+$/|max:255',
      'personnel.*.surname' => 'required|string|regex:/^[A-Za-z\s]+$/|max:255',
      'personnel.*.name_extension' => 'nullable|string|regex:/^[A-Za-z\s]+$/|max:255',
      'personnel.*.email' => 'required|email|unique:'.Personnel::class.',email',
      'personnel.*.mobile_number' => 'nullable|string|size:10',
      'personnel.*.roles' => ['required', 'list'],
      'personnel.*.sections' => ['required', 'list', new ValidSection],
      'personnel.*.password' => ['required', Password::defaults()],
    ]);

    $personnelList = collect($request->personnel);
    $newPersonnelCount = 0;

    $personnelList->each(function (mixed $personnel) {
      $newPersonnel = new Personnel();
      
      $newPersonnel->fill([
        'first_name' => $personnel['first_name'],
        'middle_name' => array_key_exists('middle_name', $personnel) ? $personnel['middle_name'] : null,
        'surname' => $personnel['surname'],
        'name_extension' => array_key_exists('name_extension', $personnel) ? $personnel['name_extension'] : null,
        'email' => $personnel['email'],
        'mobile_number' => array_key_exists('mobile_number', $personnel) ? $personnel['mobile_number'] : null,
        'password' => Hash::make($personnel['password']),
      ]);

      $newPersonnel->save();

      $newPersonnel->syncRoles($personnel['roles']);
      $newPersonnel->sections()->attach($personnel['sections']);

    });

  }

  public function listActivity(Request $request, int $id) {
    $personnel = Personnel::with(['activities' => function (Builder $query) {
      $query->orderBy('created_at', 'desc');
    }])->findOr($id, ['id', 'first_name', 'middle_name', 'surname', 'name_extension'], function () {
      abort(404); 
    });
    
    return Inertia::render('Personnel/ListPersonnelActivity', [
      'personnel' => $personnel,
    ]);
  }
}