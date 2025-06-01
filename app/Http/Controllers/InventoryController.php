<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index() {
        return Inertia::render('Inventory/InventoryIndex');
    }

    public function list() {
        return Inertia::render('Inventory/ListInventory');
    }
}
