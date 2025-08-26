<?php

namespace App\Http\Controllers;

use App\Models\Task\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MyTasksController extends Controller
{
    public function list(Request $request) {
        $user = $request->user();
        return Inertia::render('MyTasks/ListMyTasks', [
            'tasks' => $user->assignedTasks->load(['priority', 'type', 'creator']),
        ]);
    }

    public function updateStatus(Request $request, int $id) {
        $request->validate([
            'status' => [
                'required',
                Rule::in(['started', 'finished', 'canceled']),
            ],
        ]);
        
        $task = Task::findOr($id, function () {
            abort(404);
        });
        $user = $request->user();

        if ($request->input('status') === 'started') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => Date::now(),
            ]);
        } else if ($request->input('status') === 'canceled') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => null,
            ]);
        } else {
            $task->personnel()->updateExistingPivot($user->id, [
                'finished_at' => Date::now(),
            ]);
        }

        return back();
    }
}
