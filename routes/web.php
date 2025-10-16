<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\MeetingsController;
use App\Http\Controllers\MyTasksController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TasksController;
use App\Models\Barangay;
use App\Models\Incident;
use App\Models\Personnel;
use App\Models\Task\Task;
use App\Models\Task\TaskType;
use App\StatusEnum;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'first_time'])->group(function () {
    Route::get('/dashboard', function () {
        $incidentData = DB::table('incidents')
            ->join('barangays', 'incidents.barangay_id', '=', 'barangays.id')
            ->select('barangays.name as barangay', 'type_id', DB::raw('COUNT(*) as incidents_count'))
            ->groupBy('barangays.name', 'type_id')
            ->get();

        // Transform to: [{ barangay: 'Addition Hills', 9: 2, 5: 1 }, ...]
        $grouped = [];

        foreach ($incidentData as $row) {
            $barangayName = $row->barangay;
            $typeId = $row->type_id;
            $count = $row->incidents_count;

            if (!isset($grouped[$barangayName])) {
                $grouped[$barangayName] = ['barangay' => $barangayName];
            }
            $grouped[$barangayName][$typeId] = $count;
        }

        $grouped = array_values($grouped);
        return Inertia::render('Dashboard', [
            'types' => TaskType::all()->pluck('name', 'id'),
            'incidents' => $grouped,
            'availablePersonnel' => Personnel::where('status', StatusEnum::AVAILABLE)->count(),
            'ongoingTasks' => Task::whereNull('finished_at')->count(),
        ]);
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
        Route::get('/{id}', [PersonnelController::class, 'show']);
        Route::get('/{id}/activity', [PersonnelController::class, 'listActivity']);
        Route::get('/{id}/location-history/{date?}', [PersonnelController::class, 'listLocationHistory']);
    });

    Route::prefix('meetings')->name('meetings.')->group(function () {
        Route::get('/', [MeetingsController::class, 'list'])->name('list');
        Route::get('/new', [MeetingsController::class, 'new'])->name('new');
        Route::post('/new', [MeetingsController::class, 'create'])->name('create')->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/{id}', [MeetingsController::class, 'show'])->name('show');
    });

    Route::prefix('my-tasks')->group(function() {
        Route::get('/', [MyTasksController::class, 'list']);
        Route::get('/{id}', [MyTasksController::class, 'show']);
        Route::post('/{id}/status', [MyTasksController::class, 'updateStatus']);
    });

    Route::prefix('inventory')->group(function() {
        Route::get('/', [InventoryController::class, 'index']);
        Route::post('/equipment/new', [InventoryController::class, 'createEquipment'])->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/equipment/{ID}', [InventoryController::class, 'showEquipment']);
        Route::post('/consumable/new', [InventoryController::class, 'createConsumable'])->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/consumable/{ID}', [InventoryController::class, 'showConsumable']);
        Route::post('/transaction/new', [InventoryController::class, 'createTransaction'])->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/{typeID}', [InventoryController::class, 'list']);
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/', [TasksController::class, 'list']);
        Route::get('/new', [TasksController::class, 'new']);
        Route::post('/new', [TasksController::class, 'create'])->middleware([HandlePrecognitiveRequests::class]);
        Route::get('/{id}', [TasksController::class, 'show']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile/token/{id}', [ProfileController::class, 'revokeToken']);
    });

    Route::prefix('notifications')->group(function () {
        Route::get('/all', [NotificationsController::class, 'listAll'])->name('notifications.list.all');
        Route::get('/unread', [NotificationsController::class, 'listUnread'])->name('notifications.list.unread');
        Route::patch('/{id}/read', [NotificationsController::class, 'markAsRead']);
        Route::patch('/{id}/unread', [NotificationsController::class, 'markAsUnread']);
    });
});
                            
require __DIR__.'/auth.php';
