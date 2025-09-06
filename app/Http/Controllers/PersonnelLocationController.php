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
            ['latitude' => $request['latitude'], 'longitude' => $request['longitude'], 'id' => $user->id],
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        return response('ok', status: 200);
    }
}
