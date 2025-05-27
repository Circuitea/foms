<?php

use App\Http\Controllers\MeetingsController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('personnel')->middleware(['auth', 'verified'])->group(function () {
    Route::get('', [PersonnelController::class, 'list']);
    Route::get('new', [PersonnelController::class, 'new']);
    Route::post('new', [PersonnelController::class, 'create']);
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
