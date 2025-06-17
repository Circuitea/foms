<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MeetingsController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\PersonnelLocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TasksController;
use App\Models\PersonnelLocation;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/map', function () {
    return Inertia::render('Mapping/Map');
})->middleware(['auth', 'verified'])->name('map');

Route::prefix('map')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', [MapController::class, 'index']);

    Route::get('/report', function () {
        return Inertia::render('Mapping/Report');
    });

    Route::get('/presentation', function () {
        return Inertia::render('Mapping/Presentation');
    });
});
Route::post('location', [PersonnelLocationController::class, 'store']);

Route::prefix('personnel')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [PersonnelController::class, 'list']);
    Route::get('/new', [PersonnelController::class, 'new']);
    Route::post('/new', [PersonnelController::class, 'create'])->middleware([HandlePrecognitiveRequests::class]);
});

Route::prefix('meetings')-> middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [MeetingsController::class, 'list']);
    Route::get('/new', [MeetingsController::class, 'new']);
    Route::post('/new', [MeetingsController::class, 'create']);
});

Route::prefix('notifications')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', [NotificationsController::class, 'list']);
    Route::get('/{id}', [NotificationsController::class, 'show']);
});

Route::prefix('inventory')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', [InventoryController::class, 'index']);
    Route::get('/category', [InventoryController::class, 'list']);
});

Route::prefix('tasks')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [TasksController::class, 'new']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
