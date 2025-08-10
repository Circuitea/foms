<?php

use App\Events\LocationUpdated;
use App\Http\Resources\PersonnelLocationResource;
use App\Models\Personnel;
use App\Models\PersonnelLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/location', function (Request $request) {
        $user = $request->user();

        Log::info('New location update', [
            'user' => $user->id,
            'lat' => $request['latitude'],
            'lng' => $request['longitude'],
        ]);

        PersonnelLocation::upsert([
            ['latitude' => $request['latitude'], 'longitude' => $request['longitude'], 'id' => $user->id],
        ], uniqueBy: ['id'], update: ['latitude', 'longitude']);

        LocationUpdated::dispatch(PersonnelLocationResource::collection(PersonnelLocation::all()));

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
