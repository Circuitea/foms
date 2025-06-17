<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\info;
use function Laravel\Prompts\outro;
use function Laravel\Prompts\progress;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\table;


function convexHull($points)
{
    /* Ensure point doesn't rotate the incorrect direction as we process the hull halves */
    $cross = function($o, $a, $b) {
        return ($a[0] - $o[0]) * ($b[1] - $o[1]) - ($a[1] - $o[1]) * ($b[0] - $o[0]);
    };

    $pointCount = count($points);
    sort($points);
    if ($pointCount > 1) {

        $n = $pointCount;
        $k = 0;
        $h = array();

        /* Build lower portion of hull */
        for ($i = 0; $i < $n; ++$i) {
            while ($k >= 2 && $cross($h[$k - 2], $h[$k - 1], $points[$i]) <= 0)
                $k--;
            $h[$k++] = $points[$i];
        }

        /* Build upper portion of hull */
        for ($i = $n - 2, $t = $k + 1; $i >= 0; $i--) {
            while ($k >= $t && $cross($h[$k - 2], $h[$k - 1], $points[$i]) <= 0)
                $k--;
            $h[$k++] = $points[$i];
        }

        /* Remove all vertices after k as they are inside of the hull */
        if ($k > 1) {

            /* If you don't require a self closing polygon, change $k below to $k-1 */
            $h = array_splice($h, 0, $k-1); 
        }

        return $h;

    }
    else if ($pointCount <= 1)
    {
        return $points;
    }
    else
    {
        return null;
    }
}

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
        
        // $elements = collect(Storage::json('boundaries.json')['elements'])->keyBy('id');

        info('Found ' . $elements->count() . ' relations (barangays).');

        // table(
        //     headers: ['ID', 'Name'],
        //     rows: $relations->map(fn ($relation) => [
        //         'id' => $relation['id'],
        //         'name' => $relation['tags']['name'],
        //     ]),
        // );

        // progress(
        //     label: 'Creating individual Barangay Boundary JSON files',
        //     steps: $elements->all(),
        //     callback: function ($element) {
        //         $boundary = Http::get('https://nominatim.openstreetmap.org/lookup', [
        //             'osm_ids' => 'R' . $element['id'],
        //             'format' => 'geojson',
        //             'polygon_geojson' => '1',
        //         ]);

        //         Storage::put('boundaries/boundary-' . $element['id'] . '.geojson', $boundary->body());
        //     }
        // );

        $itemsPerBatch = 50;

        for ($i = 1; $i <= ceil($elements->count() / $itemsPerBatch); $i++) {
            $batch = $elements->forPage($i, $itemsPerBatch)->map(fn ($element) => 'R' . $element['id'])->join(',');

            info($batch);

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
