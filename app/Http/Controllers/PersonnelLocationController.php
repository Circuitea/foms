<?php

namespace App\Http\Controllers;

use App\Models\PersonnelLocation;
use Illuminate\Http\Request;

class PersonnelLocationController extends Controller
{
    public function store(Request $request)  {
        PersonnelLocation::upsert([
            ['id' => 1, 'latitude' => $request->input('latitude'), 'longitude' => $request->input('longitude')]
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        return response(status: 200);
    }
}
