<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use YieldStudio\LaravelExpoNotifier\Models\ExpoToken;


class PersonalAccessToken extends SanctumPersonalAccessToken
{
    public function expoTokens(): MorphMany
    {
        return $this->morphMany(ExpoToken::class, 'owner');
    }
}
