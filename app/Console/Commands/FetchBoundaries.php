<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\info;
use function Laravel\Prompts\outro;
use function Laravel\Prompts\spin;

class FetchBoundaries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-boundaries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Boundary Data of City and Barangays from Overpass Turbo';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        info('Fetching Boundary Data from Overpass Turbo API');

        $query = "[out:json][timeout:60];

        relation(2284210);
        map_to_area->.city;

        relation(area.city)[\"boundary\"=\"administrative\"][\"admin_level\"=\"10\"];

        out tags;";

        $response = spin(
            message: 'Sending query to Overpass API',
            callback: fn () => Http::withBody($query, 'plain/text')
                ->post('https://overpass-api.de/api/interpreter', ),
        );

        if ($response->failed()) {
            $this->fail($response->body());
        }
        
        $elements = collect($response->json()['elements'])->keyBy('id');

        info('Found ' . $elements->count() . ' relations (barangays).');

        $itemsPerBatch = 50;

        for ($i = 1; $i <= ceil($elements->count() / $itemsPerBatch); $i++) {
            $batch = $elements->forPage($i, $itemsPerBatch)->map(fn ($element) => 'R' . $element['id'])->join(',');

            $response = Http::withHeaders([
                'User-Agent' => 'FOMS / 1.0.0 Laravel',
            ])->get('https://nominatim.openstreetmap.org/lookup', [
                'osm_ids' => $batch,
                'format' => 'json',
                'polygon_geojson' => '1',
            ]);

            $barangays = collect($response->json());

            $barangays->each(function ($barangay) {
                Storage::put('boundaries/boundary-' . $barangay['osm_id'] . '.json', collect($barangay)->toJson());
            });
        }

        outro('Fetched.');
    }
}
