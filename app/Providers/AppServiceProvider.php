<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Relation::enforceMorphMap([
            'in_person_meeting' => 'App\Models\InPersonMeeting',
            'zoom_meeting' => 'App\Models\ZoomMeeting',
            'google_meeting' => 'App\Models\GoogleMeeting',
        ]);
    }
}
