<?php

use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PersonnelLocationController;
use App\Models\ActivityDetail;
use App\Models\CancelTaskActivity;
use App\Models\ChangeStatusActivity;
use App\Models\FinishTaskActivity;
use App\Models\Inventory\ConsumableItem;
use App\Models\Personnel;
use App\Models\StartTaskActivity;
use App\PermissionsEnum;
use App\Services\AnalyticsService;
use App\StatusEnum;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/location-history/people/{date?}', function (Request $request, ?string $date = null) {
        Gate::authorize(PermissionsEnum::LOCATION_HISTORY_GENERATE);
        $targetDate = $date ?? now()->toDateString();

        $personnel = Personnel::with(['locationHistory' => function (Builder $query) use ($targetDate) {
            $query->whereDate('created_at', $targetDate);
        }])
            ->whereHas('locationHistory', function (Builder $query) use ($targetDate) {
                $query->whereDate('created_at', $targetDate);
            })
            ->get();

        $personnel->each(function ($person) {
            $person->locationHistory->each->append('location_name');
        });

        return response()->json($personnel);
    });

    Route::get('/status', function (Request $request) {
        return response()->json([
            'status' => $request->user()->status,
        ]);
    });

    Route::post('/status', function (Request $request) {
        $validated = $request->validate([
            'status' => ['nullable', 'string', Rule::enum(StatusEnum::class)],
        ]);
        
        $user = $request->user();

        
        $oldStatus = $user->status;
        
        $newStatus = StatusEnum::from($validated['status']);
        
        $user->status = $newStatus;
        $user->save();

        $changeStatusActivity = ChangeStatusActivity::create([
            'old_status' => is_null($oldStatus) ? StatusEnum::UNAVAILABLE : $oldStatus ,
            'new_status' => $newStatus,
        ]);
        
        $activityDetail = new ActivityDetail();
        $activityDetail->personnel()->associate($user);
        $activityDetail->activity()->associate($changeStatusActivity);
        $activityDetail->save();
        
        return response([
            'status' => $user->status,
        ]);
        
    });

    Route::post('/location', [PersonnelLocationController::class, 'store']);

    Route::post('/expo-token', function (Request $request) {
        Log::info('Received token from mobile application');
        $token = $request->user()->currentAccessToken();

        $data = $request->validate([
            'token' => ['required', 'string', 'regex:/^ExponentPushToken\[.+\]$/'],
        ]);

        /** @disregard */
        $token->expoTokens()->firstOrCreate([
            'value' => $data['token'],
        ]);

        return response([
            'status' => 'ok',
        ]);

    });

    Route::delete('/logout', function (Request $request) {
        $token = $request->user()->currentAccessToken();
        /** @disregard */
        $token->expoTokens()->delete();
        /** @disregard */
        $token->delete();

        return response([
            'status' => 'OK',
        ]);
    });

    Route::get('/active-task', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'task' => $user
                ->assignedTasks()
                ->wherePivotNull('finished_at')
                ->orderByDesc('created_at')
                ->first()
                ->load(['creator', 'type', 'priority'])
            // 'task' => null,
        ]);
    });
    
    Route::get('/tasks', function (Request $request) {
        $user = $request->user();

        return response([
            'tasks' => $user->assignedTasks->load([
                'priority',
                'type',
                'creator',
            ]),
        ]);
    });

    Route::get('/task/{id}', function (Request $request, string $id) {
        $task = $request->user()->assignedTasks
            ->findOrFail($id)
            ->load([
                'priority',
                'type',
                'creator',
                'transaction' => ['equipment.item.group.type', 'consumables.item.type'],
            ]);

        return response([
            'task' => $task,
        ]);
    });

    Route::post('/task/{id}/status', function (Request $request, string $id) {
        $request->validate([
            'status' => [
                'required',
                Rule::in(['started', 'finished', 'canceled']),
            ],
            'additional_notes' => 'nullable|string|max:65535',
        ]);

        $user = $request->user();

        $task = $user->assignedTasks
            ->findOrFail($id)
            ->load([
                'priority',
                'type',
                'creator',
                'transaction' => ['equipment.item.group.type', 'consumables.item.type'],
            ]);
        

        if ($request->input('status') === 'started') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => Date::now(),
            ]);
            $activity = new StartTaskActivity();
            $activity->task()->associate($task);
            $activity->save();
        } else if ($request->input('status') === 'canceled') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => null,
            ]);
            $user->status = StatusEnum::AVAILABLE;
            $user->save();
            $activity = new CancelTaskActivity();
            $activity->task()->associate($task);
            $activity->save();
        } else {
            $task->personnel()->updateExistingPivot($user->id, [
                'finished_at' => Date::now(),
                'additional_notes' => $request->input('additional_notes'),
            ]);
            $user->status = StatusEnum::AVAILABLE;
            $user->save();

            $activity = new FinishTaskActivity();
            $activity->task()->associate($task);
            $activity->save();

            $allFinished = $task->personnel->every(function ($person) {
                return !is_null($person->pivot->finished_at);
            });

            if ($allFinished) {
                $task->finished_at = Date::now();
                $task->save();
            }
        }

        $activityDetail = new ActivityDetail();
        $activityDetail->personnel()->associate($user);
        $activityDetail->activity()->associate($activity);
        $activityDetail->save();

        return response([
            'task' => [
                ... $task->toArray(),
                'pivot' => $task->personnel()->where('personnel.id', $user->id)->first()?->pivot,
            ],
        ]);
    });

    Route::get('/inventory/consumable/{id}/recommendation', function (Request $request, string $id, AnalyticsService $analytics) {
        $item = ConsumableItem::findOr($id, function () { abort(404); });

        if (is_null($item->model_identifier)) {
            return response([
                'message' => 'This item does not have a trained model and cannot generate recommendations.',
            ], 422);
        }

        $date = Date::now();
        $start_date = $date->copy()->subMonths(6)->startOfMonth();

        $monthlyData = DB::table('consumable_transaction_entries')
        ->join('transactions', 'consumable_transaction_entries.transaction_id', '=', 'transactions.id')
        ->where('consumable_transaction_entries.item_id', $item->id)
        ->where('consumable_transaction_entries.quantity', '<', 0)
        ->where('transactions.created_at', '>=', $start_date)
        ->select(
            DB::raw('YEAR(transactions.created_at) as year'),
            DB::raw('MONTH(transactions.created_at) as month'),
            DB::raw('SUM(consumable_transaction_entries.quantity) as total_quantity')
        )
        ->groupBy(DB::raw('YEAR(transactions.created_at), MONTH(transactions.created_at)'))
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get()
        ->map(fn ($entry) => abs((int) $entry->total_quantity))
        ->pad(3, 0);

        $prediction = $analytics->getRecommendation($id, $item->model_identifier, $date, $monthlyData);

        return response()->json([
            'prediction' => [
                'raw' => $prediction,
                'formatted' => round($prediction),
            ],
        ]);
    });
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = Personnel::where('email', $request->email)->first();

    if ( !$user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json([
        'token' => $token,
    ]);

    Route::prefix('notifications')->group(function () {
        Route::get('/all', [NotificationsController::class, 'listAll']);
        Route::get('/unread', [NotificationsController::class, 'listUnread']);
        Route::patch('/{id}/read', [NotificationsController::class, 'markAsRead']);
        Route::patch('/{id}/unread', [NotificationsController::class, 'markAsUnread']);
    });
});
