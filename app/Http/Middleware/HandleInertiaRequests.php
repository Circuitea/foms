<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $permissions = [];
        $profilePicture = null;

        if ($user) {
            $permissions = $user->getAllPermissions()->pluck('name');
            if ($user->profile_picture_filename !== null) {
                $profilePicture = Storage::url($user->profile_picture_filename);
            }
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user, 
                'permissions' => $permissions,
                'profilePicture' => $profilePicture,
            ],
        ];
    }
}
