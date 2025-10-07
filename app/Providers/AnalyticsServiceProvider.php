<?php

namespace App\Providers;

use App\Services\AnalyticsService;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class AnalyticsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(AnalyticsService::class, function (Application $app) {
            return new AnalyticsService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
