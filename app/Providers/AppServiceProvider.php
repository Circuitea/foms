<?php

namespace App\Providers;

use App\Models\Personnel;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;

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
            'personnel' => 'App\Models\Personnel',
            'login_activity' => 'App\Models\LoginActivity',
            'logout_activity' => 'App\Models\LogoutActivity',
            'start_task_activity' => 'App\Models\StartTaskActivity',
            'finish_task_activity' => 'App\Models\FinishTaskActivity',
            'change_status_activity' => 'App\Models\ChangeStatusActivity',
        ]);

        Gate::define('revoke-token', fn (Personnel $user, PersonalAccessToken $token) => $token->tokenable()->is($user));
    }
}
