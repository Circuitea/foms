<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewConsumableItemRequest;
use App\Http\Requests\NewEquipmentItemRequest;
use App\Http\Requests\NewTransactionRequest;
use App\Models\Inventory\ConsumableItem;
use App\Models\Inventory\ConsumableTransactionEntry;
use App\Models\Inventory\EquipmentGroup;
use App\Models\Inventory\EquipmentItem;
use App\Models\Inventory\EquipmentTransactionEntry;
use App\Models\Inventory\ItemType;
use App\Models\Inventory\Transaction;
use App\PermissionsEnum;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index() {
        Gate::authorize(PermissionsEnum::INVENTORY_READ);
        return Inertia::render('Inventory/InventoryIndex', [
            'types' => ItemType::all(),
            'items' => [
                'equipment' => EquipmentGroup::with(['type', 'items'])->get()->each->loadCount('items'),
                'consumables' => ConsumableItem::with(['type'])->get()->each->loadSum('entries as count', 'quantity'),
            ],
        ]);
    }

    public function list(Request $request, string $typeID) {
        Gate::authorize(PermissionsEnum::INVENTORY_READ);
        $type = ItemType::findOrFail($typeID);
        return Inertia::render('Inventory/ListInventory', [
            'type' => $type,
            'items' => [
                'equipment' => $type->equipmentGroups->each->load('items'),
                'consumables' => $type->consumables,
            ],
        ]);
    }

    public function createConsumable(NewConsumableItemRequest $request) {
        Gate::authorize(PermissionsEnum::INVENTORY_CREATE);
        DB::transaction(function() use ($request) {
            $validated = $request->validated();
            $type = ItemType::find($validated['type_id']);
            $user = Auth::user();

            $newItem = new ConsumableItem();
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

            $transactionEntry = new ConsumableTransactionEntry();
            $transactionEntry->quantity = $request['initial_quantity'];

            $transactionEntry->transaction()->associate($transaction);
            $transactionEntry->item()->associate($newItem);

            $transactionEntry->save();
        });

        return redirect('/inventory');
    }

    public function createEquipment(NewEquipmentItemRequest $request) {
        Gate::authorize(PermissionsEnum::INVENTORY_CREATE);
        DB::transaction(function() use ($request) {
            $validated = $request->validated();
            $group = null;

            if ($validated['group_id'] === 'new') {
                $group = EquipmentGroup::create([
                    'name' => $validated['group_name'],
                    'type_id' => $validated['group_type_id'],
                ]);
            } else {
                $group = EquipmentGroup::find($validated['group_id']);
            }

            $newItem = new EquipmentItem();
            $newItem->fill([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'location' => $validated['location'],
            ]);
            $newItem->group()->associate($group);
            $newItem->save();
        });
        
        return redirect('/inventory');
    }

    public function createTransaction(NewTransactionRequest $request) {
        Gate::authorize(PermissionsEnum::INVENTORY_TRANSACTION_CREATE);
        DB::transaction(function () use ($request) {
            $validated = $request->validated();
            $user = Auth::user();

            $newTransaction = Transaction::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'personnel_id' => $user->id,
            ]);

            collect($validated['entries'])->each(function ($entry) use ($newTransaction) {
                if ($entry['type'] === 'equipment') {
                    $equipmentItem = EquipmentItem::find($entry['item_id']);
                    $newEntry = new EquipmentTransactionEntry();
                    $newEntry->item()->associate($equipmentItem);
                    $newEntry->transaction()->associate($newTransaction);
                    $newEntry->save();
                } else if($entry['type'] === 'consumable') {
                    $consumableItem = ConsumableItem::find($entry['item_id']);
                    $newEntry = new ConsumableTransactionEntry();
                    $newEntry->quantity = $entry['quantity'];
                    $newEntry->item()->associate($consumableItem);
                    $newEntry->transaction()->associate($newTransaction);
                    $newEntry->save();
                }
            });
        });


        return redirect('/inventory');
    }

    public function showEquipment(Request $request, string $id) {
        Gate::authorize(PermissionsEnum::INVENTORY_READ);
        $group = EquipmentGroup::with(['type'])->findOrFail($id);

        // Get available year-months from transaction entries for all items in this group
        $rawMonths = DB::table('equipment_transaction_entries')
            ->join('transactions as t', 'equipment_transaction_entries.transaction_id', '=', 't.id')
            ->join('equipment_items', 'equipment_transaction_entries.item_id', '=', 'equipment_items.id')
            ->where('equipment_items.group_id', $group->id)
            ->selectRaw('YEAR(t.created_at) as year, MONTH(t.created_at) as month')
            ->groupBy(DB::raw('YEAR(t.created_at), MONTH(t.created_at)'))
            ->orderByRaw('year ASC, month ASC')
            ->get()
            ->toArray();

        // Determine default start/end months
        if (!empty($rawMonths)) {
            $first = $rawMonths[0];
            $last = $rawMonths[array_key_last($rawMonths)];
            $defaultStartMonth = sprintf('%04d-%02d', $first->year, $first->month);
            $defaultEndMonth = sprintf('%04d-%02d', $last->year, $last->month);
        } else {
            $defaultStartMonth = now()->subMonths(5)->format('Y-m');
            $defaultEndMonth = now()->format('Y-m');
        }

        $startMonth = $request->input('start_month', $defaultStartMonth);
        $endMonth = $request->input('end_month', $defaultEndMonth);

        // Parse to full date range
        try {
            $startDate = Date::createFromFormat('Y-m', $startMonth)->startOfMonth();
            $endDate = Date::createFromFormat('Y-m', $endMonth)->endOfMonth();
        } catch (\Exception $e) {
            abort(422, 'Invalid month format. Use YYYY-MM.');
        }

        if ($endDate->lt($startDate)) {
            abort(422, 'End month must be after or equal to start month.');
        }

        // Load items with filtered entries
        $group->load(['items' => function ($query) use ($startDate, $endDate) {
            $query->with(['entries' => function ($q) use ($startDate, $endDate) {
                $q->whereHas('transaction', function ($t) use ($startDate, $endDate) {
                    $t->whereBetween('created_at', [$startDate, $endDate]);
                });
                $q->with(['transaction' => ['personnel', 'task.personnel']]);
            }]);
        }]);

        // Build monthsByYear structure
        $monthsByYear = [];
        foreach ($rawMonths as $row) {
            $monthsByYear[$row->year][] = (int)$row->month;
        }
        foreach ($monthsByYear as &$months) {
            sort($months);
        }
        krsort($monthsByYear);

        return inertia('Inventory/ShowEquipmentItem', [
            'item' => fn () => $group,
            'months' => $monthsByYear,
            'start_date' => Inertia::always($startMonth),
            'end_date' => Inertia::always($endMonth),
        ]);
    }

    public function showConsumable(Request $request, string $id) {
        Gate::authorize(PermissionsEnum::INVENTORY_READ);
        $item = ConsumableItem::with(['type'])->findOrFail($id);

        $rawMonths = $item->entries()
            ->join('transactions as t', 'consumable_transaction_entries.transaction_id', '=', 't.id')
            ->selectRaw('YEAR(t.created_at) as year, MONTH(t.created_at) as month')
            ->groupBy(DB::raw('YEAR(t.created_at), MONTH(t.created_at)'))
            ->orderByRaw('year DESC, month ASC')
            ->get()
            ->toArray();
        
        $months = [];

        foreach($rawMonths as $row) {
            $months[$row['year']][] = $row['month'];
        }

        if (!empty($rawMonths)) {
            usort($rawMonths, fn($a, $b) =>
                ($a['year'] <=> $b['year']) ?: ($a['month'] <=> $b['month'])
            );
        
            $first = $rawMonths[0];
            $last = $rawMonths[array_key_last($rawMonths)];
        
            $defaultStartMonth = sprintf('%04d-%02d', $first['year'], $first['month']);
            $defaultEndMonth = sprintf('%04d-%02d', $last['year'], $last['month']);
        } else {
            // Fallback to current and previous months if no data
            $defaultStartMonth = now()->subMonths(5)->format('Y-m');
            $defaultEndMonth = now()->format('Y-m');
        }

        $startMonth = $request->input('start_date', $defaultStartMonth);
        $endMonth = $request->input('end_date', $defaultEndMonth);

        $startDate = Date::createFromFormat('Y-m', $startMonth)->startOfMonth()->toDateString();
        $endDate = Date::createFromFormat('Y-m', $endMonth)->endOfMonth()->toDateString();

        $item->load(['entries' => function (Builder $query) use($startDate, $endDate) {
            $query->whereHas('transaction', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('created_at', [$startDate, $endDate]);
            });
            $query->with(['transaction' => ['personnel', 'task.personnel']]);
            // Add running total for each entry
            $query->selectRaw('
                consumable_transaction_entries.*,
                SUM(consumable_transaction_entries.quantity) OVER (
                    ORDER BY consumable_transaction_entries.id
                ) AS running_total
            ');
        }]);

        $totals = $item->entries()
            ->join('transactions as t', 'consumable_transaction_entries.transaction_id', '=', 't.id')
            ->whereBetween('t.created_at', [$startDate, $endDate])
            ->selectRaw("
                YEAR(t.created_at) as year,
                WEEK(t.created_at, 3) as week,
                SUM(consumable_transaction_entries.quantity) as weekly_quantity,
                SUM(SUM(consumable_transaction_entries.quantity)) OVER (ORDER BY YEAR(t.created_at), WEEK(t.created_at, 3)) as running_total
            ")
            ->groupBy(DB::raw("YEAR(t.created_at), WEEK(t.created_at,3)"))
            ->orderByRaw('year, week')
            ->get();

        return Inertia::render('Inventory/ShowConsumableItem', [
            'start_date' => Inertia::always($startMonth),
            'end_date' => Inertia::always($endMonth),
            'item' => Inertia::always($item),
            'totals' => fn () => $totals,
            'months' => $months,
        ]);
    }
}
