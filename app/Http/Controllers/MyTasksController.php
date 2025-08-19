<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MyTasksController extends Controller
{
    public function list() {
        return Inertia::render('MyTasks/ListMyTasks');
    }

    public function show(Request $request, string $id) {
        // Fetch MODEL here
        return Inertia::render('Notifications/ShowNotifications');
    }
}
