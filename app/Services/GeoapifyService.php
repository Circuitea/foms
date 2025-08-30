<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeoapifyService
{
  protected string $apiKey;

  public function __construct()
  {
    $this->apiKey = config('services.geoapify.api_key');
  }

  public function reverseGeocode(string $latitude, string $longitude) {
    $lat = $this->truncateCoordinate($latitude);
    $lon = $this->truncateCoordinate($longitude);
    $cacheKey = "reverse_geocode:{$lat},{$lon}";

    return Cache::rememberForever($cacheKey, function () use($lat, $lon) {
      $response = Http::retry(3, 100)
        ->withQueryParameters([
          'apiKey' => $this->apiKey,
          'type' => 'amenity',
          'limit' => 1,
          'lang' => 'en',
          'lat' => $lat,
          'lon' => $lon,
          'format' => 'json',
        ])
        ->get('https://api.geoapify.com/v1/geocode/reverse');

      $street = $response->json('results.0.street');

      $barangay = $response->json(
        'results.0.suburb',
        $response->json(
          'results.0.district',
          null
        ),
      );

      return $street . ($barangay ? ', Brgy. ' . $barangay : '');

    });
  }

  private function truncateCoordinate(string $coordinate) {
    $matches = [];
    $pattern = "/^(-?\d+)(\.\d{0,6})?/";

    if (preg_match($pattern, $coordinate, $matches)) {
      return $matches[0];
    }
  }
}
