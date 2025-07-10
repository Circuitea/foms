<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MeetingsController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TasksController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'first_time'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/map', function () {
        return Inertia::render('Mapping/Map');
    })->name('map');

    Route::prefix('map')->group(function() {
        Route::get('/', [MapController::class, 'index']);

        Route::get('/report', function () {
            return Inertia::render('Mapping/Report');
        });

        Route::get('/presentation', function () {
            return Inertia::render('Mapping/Presentation');
        });
    });

    Route::prefix('personnel')->group(function () {
        Route::get('/', [PersonnelController::class, 'list']);
        Route::get('/new', [PersonnelController::class, 'new']);
        Route::post('/new', [PersonnelController::class, 'create'])->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/import', [PersonnelController::class, 'import']);
        Route::post('/import', [PersonnelController::class, 'add']);
    });

    Route::prefix('meetings')->name('meetings.')->group(function () {
        Route::get('/', [MeetingsController::class, 'list'])->name('list');
        Route::get('/new', [MeetingsController::class, 'new'])->name('new');
        Route::post('/new', [MeetingsController::class, 'create'])->name('create')->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/{id}', [MeetingsController::class, 'show'])->name('show');
    });

    Route::prefix('notifications')->group(function() {
        Route::get('/', [NotificationsController::class, 'list']);
        Route::get('/{id}', [NotificationsController::class, 'show']);
    });

    Route::prefix('inventory')->group(function() {
        Route::get('/', [InventoryController::class, 'index']);
        Route::get('/item/ID');
        Route::get('/{typeID}', [InventoryController::class, 'list']);
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/', [TasksController::class, 'new']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile/token/{id}', [ProfileController::class, 'revokeToken']);
    });
});

require __DIR__.'/auth.php';
