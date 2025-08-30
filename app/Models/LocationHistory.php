<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
