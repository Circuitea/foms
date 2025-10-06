<?php

namespace App\Http\Controllers;

use App\Models\ActivityDetail;
use App\Models\CancelTaskActivity;
use App\Models\FinishTaskActivity;
use App\Models\StartTaskActivity;
use App\Models\Task\Task;
use App\Models\Task\TaskReport;
use App\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;

class MyTasksController extends Controller
{
    public function list(Request $request) {
        $user = $request->user();
        return Inertia::render('MyTasks/ListMyTasks', [
            'tasks' => $user->assignedTasks->load([
                'priority',
                'type',
                'creator',
            ]),
        ]);
    }

    public function updateStatus(Request $request, int $id) {
        $request->validate([
            'status' => [
                'required',
                Rule::in(['started', 'finished', 'canceled']),
            ],
            'additional_notes' => 'string|max:65535',
        ]);
        
        $task = Task::findOr($id, function () {
            abort(404);
        });
        $user = $request->user();

        if ($request->input('status') === 'started') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => Date::now(),
            ]);
            $user->status = Status::ASSIGNED;
            $user->save();
            $activity = new StartTaskActivity();
            $activity->task()->associate($task);
            $activity->save();
        } else if ($request->input('status') === 'canceled') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => null,
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();
            $activity = new CancelTaskActivity();
            $activity->task()->associate($task);
            $activity->save();
        } else {
            $task->personnel()->updateExistingPivot($user->id, [
                'finished_at' => Date::now(),
                'additional_notes' => $request->input('additional_notes'),
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();

            $activity = new FinishTaskActivity();
            $activity->task()->associate($task);
            $activity->save();

            $allFinished = $task->personnel->every(function ($person) {
                return !is_null($person->pivot->finished_at);
            });

            if ($allFinished) {
                $task->finished_at = Date::now();
                $task->save();
            }
        }

        $activityDetail = new ActivityDetail();
        $activityDetail->personnel()->associate($user);
        $activityDetail->activity()->associate($activity);
        $activityDetail->save();

        return back();
    }

    public function showReport(Request $request, int $id) {
        $user = $request->user();
        $task = Task::findOr($id, function () {
            abort(404);
        });

        $report = $task->personnel()->where('id', $user->id)->first()->pivot->report;

        Log::info('Download requested', [
            'report' => $report,
        ]);

        return Storage::download($report->file_name, 'task' . $task->id . '_report');
    }

    public function storeReport(Request $request, int $id) {
        $request->validate([
            'report' => [
                'required',
                File::types(['pdf']),
            ],
        ]);

        $user = $request->user();
        $task = Task::findOr($id, function () {
            abort(404);
        });

        $file = $request->file('report');
        $path = $file->store('reports');

        $pivot = $task->personnel()->where('id', $user->id)->first()->pivot;
        $pivot->report()->associate(TaskReport::create(['file_name' => $path]));
        $pivot->save();

        return response('ok');
    }
}
