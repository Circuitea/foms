<?php

namespace App\Models;

use App\Facades\Geoapify;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;

class LocationHistory extends Model
{
  protected $fillable = ['latitude', 'longitude', 'personnel_id'];


  protected function casts() {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

  public function personnel(): BelongsTo
  {
    return $this->belongsTo(Personnel::class, 'personnel_id');
  }

  protected function locationName(): Attribute
  {
    return Attribute::make(
      get: fn (mixed $_, array $attributes) => Geoapify::reverseGeocode($attributes['latitude'], $attributes['longitude']),
    );
  }
}
