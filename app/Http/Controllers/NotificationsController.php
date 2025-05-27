<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    public function list() {
        return Inertia::render('Notifications/ListNotifications');
    }

    public function show(Request $request, string $id) {
        // Fetch MODEL here
        return Inertia::render('Notifications/ShowNotifications');
    }
}
