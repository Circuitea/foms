<?php

namespace App\Http\Resources;

use App\Facades\Geoapify;
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
            'personnel' => $this->personnel->toResource(),
            'name' => Geoapify::reverseGeocode($this->latitude, $this->longitude),
            'latitude' => (double) $this->latitude,
            'longitude' => (double) $this->longitude,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
