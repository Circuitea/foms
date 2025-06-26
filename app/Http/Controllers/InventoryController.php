<?php

namespace App\Http\Controllers;

use App\Models\Inventory\ItemType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index() {
        return Inertia::render('Inventory/InventoryIndex', [
            'types' => ItemType::withCount('items')->get()->map(fn (ItemType $type) => [
                'count' => $type->items_count,
                ... $type->toArray(),
            ]),
        ]);
    }

    public function list() {
        return Inertia::render('Inventory/ListInventory');
    }
}
