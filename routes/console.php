<?php

use App\Events\LocationSynced;
use App\Events\LocationUpdated;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\LocationHistory;
use App\Models\PersonnelLocation;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    DB::transaction(function () {
        PersonnelLocation::where('updated_at', '<', now()->subMinutes(5))->delete();

        PersonnelLocation::all()->each(function (PersonnelLocation $location) {
            LocationHistory::create([
                'personnel_id' => $location->personnel->id,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
            ]);
        });
    });

    $locations = PersonnelLocation::with([
        'personnel',
        'personnel.locationHistory' => function ($q) {
            $q->orderByDesc('created_at');
        },
    ])->get();

    // Trim locationHistory to latest 3 and append location_name to both personnel location and history
    $locations->each(function (PersonnelLocation $loc) {
        // Append location_name to the current personnel location
        $loc->append('location_name');

        // Trim and append location_name to each locationHistory entry
        if ($loc->relationLoaded('personnel') && $loc->personnel->relationLoaded('locationHistory')) {
            $history = $loc->personnel->locationHistory->take(3);
            $history->each(function ($historyEntry) {
                $historyEntry->append('location_name');
            });
            $loc->personnel->setRelation('locationHistory', $history);
        }
    });

    LocationSynced::dispatch($locations);
})->everyFiveMinutes();