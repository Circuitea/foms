<?php

use App\Http\Controllers\PersonnelLocationController;
use App\Models\Personnel;
use App\Models\Task\Task;
use App\Status;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;
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

    Route::post('/status', function (Request $request) {
        $validated = $request->validate([
            'status' => ['nullable', 'string', Rule::enum(Status::class)],
        ]);
        
        $user = $request->user();

        $user->status = Status::from($validated['status']);

        $user->save();

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
            'additional_notes' => 'string|max:65535',
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
            $user->status = Status::ASSIGNED;
            $user->save();
        } else if ($request->input('status') === 'canceled') {
            $task->personnel()->updateExistingPivot($user->id, [
                'started_at' => null,
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();
        } else {
            $task->personnel()->updateExistingPivot($user->id, [
                'finished_at' => Date::now(),
                'additional_notes' => $request->input('additional_notes'),
            ]);
            $user->status = Status::AVAILABLE;
            $user->save();


            $allFinished = $task->personnel->every(function ($person) {
                return !is_null($person->pivot->finished_at);
            });

            if ($allFinished) {
                $task->finished_at = Date::now();
                $task->save();
            }
        }

        return response([
            'task' => $task->refresh(),
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
});
