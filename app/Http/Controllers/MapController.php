<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index() {
        
        // $barangays = $disk->files('geojson/barangays/');
        return Inertia::render('Mapping/Map', [
            'barangays' => collect(Storage::files('boundaries'))->map(fn ($barangay) => Storage::json($barangay)),
        ]);
    }
}
