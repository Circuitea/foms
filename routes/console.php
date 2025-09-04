<?php

use App\Events\LocationUpdated;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\LocationHistory;
use App\Models\PersonnelLocation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    DB::transaction(function () {
        PersonnelLocation::all()->each(function (PersonnelLocation $location) {
            LocationHistory::create([
                'personnel_id' => $location->personnel->id,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
            ]);
        });
    });
});