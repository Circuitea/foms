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
        return [
            'id' => $this->id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'location_name' => Geoapify::reverseGeocode($this->latitude, $this->longitude),

            'personnel' => $this->personnel->toResource(),
        ];
    }
}
