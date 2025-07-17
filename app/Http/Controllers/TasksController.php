<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewTaskRequest;
use App\Models\Task\TaskPriority;
use App\Models\Task\TaskType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function list() {
        return Inertia::render('Tasks/ListTasks');
    }

    public function create() {
        return Inertia::render('Tasks/NewTask', [
            'types' => TaskType::all(),
            'priorities' => TaskPriority::all(),
        ]);
    }

    public function new(NewTaskRequest $request) {
        return redirect('/tasks');
    }
}
