<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class FirstTimeLoginController extends Controller
{
    public function show(Request $request) {
        if (!$request->user()->first_time_login) {
            return redirect('/dashboard');
        }
        return Inertia::render('Auth/FirstTimeLogin');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'first_time_login' => 0,
            'password' => Hash::make($validated['password']),
        ]);

        return redirect('/dashboard');
    }
}
