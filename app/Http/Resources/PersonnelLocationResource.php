<?php

namespace App\Http\Resources;

use App\Facades\Geoapify;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonnelLocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $personnel = $this->personnel
            ->load(['locationHistory' => function (Builder $query) {
                $query
                    ->orderByDesc('created_at')
                    ->limit(3);
            }]);

        $personnel->locationHistory->each->append('location_name');

        return [
            'personnel' => [
                ... $personnel->toArray(),
                'location_history' => $personnel->locationHistory->map(function ($history) {
                    return $history->toArray();
                }),
            ],
            'latitude' => (double) $this->latitude,
            'longitude' => (double) $this->longitude,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'location_name' => Geoapify::reverseGeocode($this->latitude, $this->longitude),
        ];
    }
}
