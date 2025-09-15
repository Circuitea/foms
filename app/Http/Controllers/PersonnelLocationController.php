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

        // Log::info('new location from user', [
        //     $user,
        //     $request['latitude'],
        //     $request['longitude'],
        // ]);

        PersonnelLocation::upsert([
            ['latitude' => $request['latitude'], 'longitude' => $request['longitude'], 'id' => $user->id],
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        LocationUpdated::dispatch(PersonnelLocation::with(['personnel.locationHistory' => function (Builder $query) {
            $query->orderBy('created_at', 'DESC')->limit(3);
        }])->get()->map(fn ($loc) => [
            ... $loc->toArray(),
            'location_name' => Geoapify::reverseGeocode($loc->latitude, $loc->longitude),
            'personnel' => [
                ... $loc->personnel->toArray(),
                'location_history' => $loc->personnel->locationHistory->each->append('location_name'),
            ]
        ]));

        return response('ok', status: 200);
    }
}
