<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property numeric $latitude
 * @property numeric $longitude
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Personnel $personnel
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PersonnelLocation whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PersonnelLocation extends Model
{
    protected $fillable = ['id', 'latitude', 'longitude'];

    protected function casts() {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'id');
    }
}
