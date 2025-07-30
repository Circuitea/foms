<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewInventoryItemRequest;
use App\ItemConditionEnum;
use App\Models\Inventory\Item;
use App\Models\Inventory\ItemCondition;
use App\Models\Inventory\ItemType;
use App\Models\Inventory\Transaction;
use App\Models\Inventory\TransactionEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index() {
        return Inertia::render('Inventory/InventoryIndex', [
            'types' => ItemType::withCount('items')->get(),
            'items' => Item::all()
                ->map(fn (Item $item) => [
                    ... $item->toArray(),
                    'conditions' => ItemCondition::with([
                        'transactionEntries' => function ($query) use ($item) {
                            $query->where('item_id', $item->id);
                        },
                    ])->get()->map(fn (ItemCondition $condition) => [
                        ... $condition->toArray(),
                        // 'label' => ItemConditionEnum::from($condition->name)->label(),
                        'label' => $condition->name->label(),
                        'amount' => $condition->transactionEntries->sum('amount'),
                    ]),
                ]),
            'totalCount' => Item::count(),
        ]);
    }

    public function list(Request $request, int $typeID) {
        return Inertia::render('Inventory/ListInventory', [
            'type' => ItemType::find($typeID),
            'items' => Item::where('type_id', $typeID)
                ->get()
                ->map(fn (Item $item) => [
                    ... $item->toArray(),
                    'conditions' => ItemCondition::with([
                        'transactionEntries' => function ($query) use ($item) {
                            $query->where('item_id', $item->id);
                        },
                    ])->get()->map(fn (ItemCondition $condition) => [
                        ... $condition->toArray(),
                        // 'label' => ItemConditionEnum::from($condition->name)->label(),
                        'label' => $condition->name->label(),
                        'amount' => $condition->transactionEntries->sum('amount'),
                    ]),
                ]),
        ]);
    }

    public function create(NewInventoryItemRequest $request) {
        DB::transaction(function() use ($request) {
            $validated = $request->validated();
            $type = ItemType::find($validated['type_id']);
            $user = Auth::user();
            $condition = ItemCondition::firstWhere('name', ItemConditionEnum::AVAILABLE);

            $newItem = new Item();
            $newItem->fill([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'location' => $validated['location'],
            ]);
            $newItem->type()->associate($type);
            $newItem->save();

            $transaction = new Transaction();
            $transaction->fill([
                'title' => 'Initial Item Quantity',
                'description' => 'Setting the initial quantity of the inventory item'
            ]);
            $transaction->personnel()->associate($user);
            $transaction->save();

            $transactionEntry = new TransactionEntry();
            $transactionEntry->amount = $request['initial_quantity'];

            $transactionEntry->transaction()->associate($transaction);
            $transactionEntry->item()->associate($newItem);
            $transactionEntry->condition()->associate($condition);

            $transactionEntry->save();
        });

        return redirect('/inventory');
    }
}
