<?php

use App\Events\LocationUpdated;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\PersonnelLocation;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    LocationUpdated::dispatch(PersonnelLocationResource::collection(PersonnelLocation::all()));
})->everyFiveSeconds();