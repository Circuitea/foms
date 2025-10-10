<?php

namespace App\Http\Controllers;

use App\Http\Resources\PersonnelLocationResource;
use App\Models\PersonnelLocation;
use App\PermissionsEnum;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        Gate::authorize(PermissionsEnum::MAP_READ);
        $locations = PersonnelLocation::with(['personnel.locationHistory' => function (Builder $query) {
            $query->orderByDesc('created_at')->limit(3);
        }])
            ->get()
            ->map(function ($location) {
                return $location->append('location_name');
            });

        return Inertia::render('Mapping/Map', [
            'barangays' => collect(Storage::files('boundaries'))->map(fn ($barangay) => Storage::json($barangay)),
            'locations' => $locations->keyBy('id'),
        ]);
    }
}
