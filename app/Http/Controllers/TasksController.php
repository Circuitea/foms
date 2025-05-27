<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function new() {
        return Inertia::render('Tasks/CreateTasks');
    }
}
