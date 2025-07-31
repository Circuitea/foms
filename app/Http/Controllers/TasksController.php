<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewTaskRequest;
use App\ItemConditionEnum;
use App\Models\Inventory\Item;
use App\Models\Inventory\ItemCondition;
use App\Models\Personnel;
use App\Models\Task\TaskPriority;
use App\Models\Task\TaskType;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    public function list() {
        return Inertia::render('Tasks/ListTasks');
    }

    public function new() {
        return Inertia::render('Tasks/NewTask', [
            'types' => TaskType::all(),
            'priorities' => TaskPriority::all(),
            'items' => Item::withSum(['transactionEntries as amount' => function ($query) {
                $query->where('condition_id', ItemCondition::firstWhere('name', ItemConditionEnum::AVAILABLE)->id);
            }], 'amount')->get()
                ->map(fn ($item) => [
                    ... $item->toArray(),
                    'amount' => (int) $item->amount,
                ])
                ->filter(fn ($item) => $item['amount'] > 0),
            'personnel' => Personnel::all(),
        ]);
    }

    public function create(NewTaskRequest $request) {
        return redirect('/tasks');
    }
}
