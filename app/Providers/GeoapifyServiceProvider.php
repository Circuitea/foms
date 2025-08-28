<?php

namespace App\Providers;

use App\Services\GeoapifyService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class GeoapifyServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(GeoapifyService::class, function (Application $app) {
            return new GeoapifyService();
        });
    }
}
