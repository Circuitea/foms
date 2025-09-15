<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewTaskRequest;
use App\ItemConditionEnum;
use App\Models\Inventory\Item;
use App\Models\Inventory\ItemCondition;
use App\Models\Inventory\Transaction;
use App\Models\Inventory\TransactionEntry;
use App\Models\Personnel;
use App\Models\Task\Task;
use App\Models\Task\TaskPriority;
use App\Models\Task\TaskType;
use App\RolesEnum;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TasksController extends Controller
{
  public function list() {
    return Inertia::render('Tasks/ListTasks', [
      'tasks' => Task::with(['priority', 'type', 'personnel'])->get(),
      'personnel' => Personnel::with(['assignedTasks', 'roles'])
        ->get()
        ->map(fn ($person) => [
          ... $person->toArray(),
          'roles' => $person->roles->map(fn ($role) => [
            ... $role->toArray(),
            'label' => RolesEnum::from($role->name)->label(),
          ]),
        ]),
    ]);
  }

  public function show(Request $request, int $id) {
    $task = Task::with(['priority', 'type', 'personnel', 'items.item', 'creator'])
      ->findOr($id, function () {
        abort(404);
      });
    return Inertia::render('Tasks/ShowTask', [
      'task' => $task,
    ]);
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
    DB::transaction(function () use ($request) {
      $validated = $request->validated();
      $type = TaskType::find($validated['type_id']);
      $priority = TaskPriority::find($validated['priority_id']);
      $creator = Auth::user();
      $newTask = new Task();

      $newTask->fill([
        'title' => $validated['title'],
        'description' => $validated['description'],
        'location' => $validated['location'],
        'due_date' => Date::createFromFormat('Y-m-d\TH:i:s.v\Z', $validated['due_date']),
        'duration' => $validated['duration'],
      ]);

      $newTask->section_id = 1;

      $newTask->type()->associate($type);
      $newTask->priority()->associate($priority);
      $newTask->creator()->associate($creator);

      $newTask->save();

      $newTask->personnel()->attach($validated['personnel']);


      $itemTransaction = new Transaction; 
      $itemTransaction->fill([
        'title' => 'Item Deployment for Task ID: ' . $newTask->id,
        'description' => 'For Deployment on Task: ' . $newTask->title,
      ]);
      $itemTransaction->personnel()->associate($creator);
      $itemTransaction->save();

      collect($validated['equipment_items'])->each(function ($item) use ($itemTransaction, $newTask) {
        $inventoryItem = Item::find($item['id']);

        $removeEntry = new TransactionEntry();
        $addEntry = new TransactionEntry();
        $removeEntry->amount = -1 * abs($item['quantity']);
        $addEntry->amount = $item['quantity'];

        $removeEntry->condition()->associate(ItemCondition::firstWhere('name', ItemConditionEnum::AVAILABLE));
        $addEntry->condition()->associate(ItemCondition::firstWhere('name', ItemConditionEnum::DEPLOYED));

        $removeEntry->transaction()->associate($itemTransaction);
        $addEntry->transaction()->associate($itemTransaction);
        
        $removeEntry->item()->associate($inventoryItem);
        $addEntry->item()->associate($inventoryItem);

        $addEntry->task()->associate($newTask);

        $removeEntry->save();
        $addEntry->save();

      });
      
    });

    return redirect('/tasks');
  }
}
