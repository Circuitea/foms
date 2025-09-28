<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewTaskRequest;
use App\ItemConditionEnum;
use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\ConsumableTransactionEntry;
use App\Models\Inventory\EquipmentGroup;
use App\Models\Inventory\EquipmentItem;
use App\Models\Inventory\EquipmentTransactionEntry;
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
    $task = Task::with(['priority', 'type', 'personnel', 'creator', 'transaction' => ['equipment.item.group.type', 'consumables.item.type']])
      ->findOr($id, function () {
        abort(404);
      });
    return Inertia::render('Tasks/ShowTask', [
      'task' => $task,
    ]);
  }

  public function new() {
    $equipmentGroups = EquipmentGroup::with([
        'items' => function ($query) {
            $query->withCount([
                'entries as unfinished_tasks_count' => function ($q) {
                    $q->join('transactions as t', 'equipment_transaction_entries.transaction_id', '=', 't.id')
                      ->join('tasks', 't.task_id', '=', 'tasks.id')
                      ->whereNull('tasks.finished_at');
                }
            ]);
        }
    ])->get();

    // Mark each item as available if unfinished_tasks_count === 0
    foreach ($equipmentGroups as $group) {
        foreach ($group->items as $item) {
            $item->is_available = ($item->unfinished_tasks_count === 0);
        }
    }

    $items = [
      'equipment' => $equipmentGroups,
      'consumables' => ConsumableItem::withSum('entries as count', 'quantity')
        ->having('count', '>=', 1)
        ->get(),
    ];

    Log::info('test', [$items]);

    return Inertia::render('Tasks/NewTask', [
      'types' => TaskType::all(),
      'priorities' => TaskPriority::all(),
      'personnel' => Personnel::all(),
      'items' => $items,
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
      $itemTransaction->task()->associate($newTask);
      $itemTransaction->save();

      $items = $validated['items'];

      collect($items['equipment'])->each(function ($item) use ($itemTransaction) {
        $equipmentItem = EquipmentItem::find($item);

        $entry = new EquipmentTransactionEntry();
        $entry->item()->associate($equipmentItem);
        $entry->transaction()->associate($itemTransaction);

        $entry->save();
      });

      collect($items['consumables'])->each(function ($item) use ($itemTransaction) {
        $consumableItem = ConsumableItem::find($item['id']);

        $entry = new ConsumableTransactionEntry();
        $entry->quantity = $item['count'];

        $entry->item()->associate($consumableItem);
        $entry->transaction()->associate($itemTransaction);

        $entry->save();
      });

      // collect($validated['equipment_items'])->each(function ($item) use ($itemTransaction, $newTask) {
      //   $inventoryItem = Item::find($item['id']);

      //   $removeEntry = new TransactionEntry();
      //   $addEntry = new TransactionEntry();
      //   $removeEntry->amount = -1 * abs($item['quantity']);
      //   $addEntry->amount = $item['quantity'];

      //   $removeEntry->condition()->associate(ItemCondition::firstWhere('name', ItemConditionEnum::AVAILABLE));
      //   $addEntry->condition()->associate(ItemCondition::firstWhere('name', ItemConditionEnum::DEPLOYED));

      //   $removeEntry->transaction()->associate($itemTransaction);
      //   $addEntry->transaction()->associate($itemTransaction);
        
      //   $removeEntry->item()->associate($inventoryItem);
      //   $addEntry->item()->associate($inventoryItem);

      //   $addEntry->task()->associate($newTask);

      //   $removeEntry->save();
      //   $addEntry->save();

      // });
      
    });

    return redirect('/tasks');
  }
}
