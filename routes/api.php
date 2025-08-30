<?php

use App\Events\LocationUpdated;
use App\Http\Controllers\PersonnelLocationController;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\Personnel;
use App\Models\PersonnelLocation;
use App\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
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

    Route::post('/expo-push-token', function (Request $request) {
        Log::info('Received token from mobile application');
        $user = $request->user();

        $data = $request->validate([
            'token' => ['required', 'string', 'regex:/^ExponentPushToken\[.+\]$/'],
        ]);

        $user->expoTokens()->firstOrCreate([
            'value' => $data['token'],
        ]);

        return response([
            'status' => 'ok',
        ]);

    });

    Route::delete('/logout', function (Request $request) {
        /** @disregard */
        $request->user()->currentAccessToken()->delete();

        return response([
            'status' => 'OK',
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

    return $user->createToken($request->device_name)->plainTextToken;
});

Route::post('/verify-token', function (Request $request) {
    Log::info('New token verification request sent.', [
        'token' => $request->bearerToken(),
    ]);

    if (!$request->bearerToken()) {
        return response()->json(['valid' => false], 401);
    }

    $token = PersonalAccessToken::findToken($request->bearerToken());
    
    return response()->json([
        'valid' => $token !== null,
    ]);
});
