<?php

namespace App\Http\Controllers;

use App\Events\LocationUpdated;
use App\Facades\Geoapify;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\LocationHistory;
use App\Models\PersonnelLocation;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PersonnelLocationController extends Controller
{
    public function store(Request $request)  {
        $user = $request->user();

        PersonnelLocation::upsert([
            ['latitude' => $request['latitude'], 'longitude' => $request['longitude'], 'id' => $user->id],
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        $location = PersonnelLocation::with(['personnel.locationHistory' => function (Builder $query) {
            $query->orderByDesc('created_at')->limit(3);
        }])->find($user->id);

        // Append location_name to the current location
        $location->append('location_name');

        // Append location_name to each locationHistory entry
        if ($location->relationLoaded('personnel') && $location->personnel->relationLoaded('locationHistory')) {
            $location->personnel->locationHistory->each(function ($historyEntry) {
                $historyEntry->append('location_name');
            });
        }

        LocationUpdated::dispatch($location);

        return response('ok', status: 200);
    }
}
