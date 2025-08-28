<?php

namespace App\Http\Controllers;

use App\Models\LocationHistory;
use App\Models\PersonnelLocation;
use Illuminate\Http\Request;

class PersonnelLocationController extends Controller
{
    public function store(Request $request)  {
        $user = $request->user();

        PersonnelLocation::upsert([
            ['id' => 1, 'latitude' => $request->input('latitude'), 'longitude' => $request->input('longitude')]
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        $history = new LocationHistory();

        $history->fill([
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        $history->personnel()->associate($user);

        return response(status: 200);
    }
}
