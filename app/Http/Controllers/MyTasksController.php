<?php

namespace App\Http\Controllers;

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
                'items.item',
            ]),
        ]);
    }

    public function updateStatus(Request $request, int $id) {
        $request->validate([
            'status' => [
                'required',
                Rule::in(['started', 'finished', 'canceled']),
            ],
            'additional_notes' => 'required_if:status,finished|string|max:65535',
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
        } else if ($request->input('status') === 'canceled') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => null,
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();
        } else {
            $task->personnel()->updateExistingPivot($user->id, [
                'finished_at' => Date::now(),
                'additional_notes' => $request->input('additional_notes'),
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();
        }

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
