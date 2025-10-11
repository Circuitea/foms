<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

class AnalyticsService
{
  protected $serviceURL;

  public function __construct()
  {
    $this->serviceURL = config('services.analytics.url');
  }

  public function getRecommendation(string $id, string $model_ident, mixed $date, mixed $quantities) {
    $url = $this->serviceURL . "/recommendations/" . $model_ident . "/make";
    $response = Http::acceptJson()
      ->post($url, [
        'month' => $date->month,
        'quantities' => $quantities,
      ]);

    $predictions = $response->json("predictions");

    return $predictions[0];
  }
}