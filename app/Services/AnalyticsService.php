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
    $cache_key = "consumable_item_recommendation:" . $id;
    return Cache::remember($cache_key, now()->endOfMonth(), function () use ($model_ident, $date, $quantities) {
      $url = $this->serviceURL . "/recommendations/" . $model_ident . "/make";
      $response = Http::acceptJson()
        ->post($url, [
          'year' => $date->year,
          'month' => $date->month,
          'quarter' => $date->quarter,
          'quantities' => $quantities,
        ]);

      $predictions = $response->json("predictions");

      return $predictions[0];
    });
  }
}