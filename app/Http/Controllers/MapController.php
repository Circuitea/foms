<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonnelLocationResource;
use App\Models\PersonnelLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        return Inertia::render('Mapping/Map', [
            'barangays' => collect(Storage::files('boundaries'))->map(fn ($barangay) => Storage::json($barangay)),
            'locations' => PersonnelLocationResource::collection(PersonnelLocation::all()),
        ]);
    }
}
