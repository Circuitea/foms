<?php

namespace App\Http\Controllers;

use App\Models\Inventory\Item;
use App\Models\Inventory\ItemType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index() {
        return Inertia::render('Inventory/InventoryIndex', [
            'types' => ItemType::withCount('items')->get(),
            'items' => Item::with('type')->simplePaginate(15),
            'totalCount' => Item::count(),
        ]);
    }

    public function list(Request $request, int $typeID) {
        return Inertia::render('Inventory/ListInventory', [
            'items' => Item::where('type_id', $typeID)->simplePaginate(15),
        ]);
    }
}
