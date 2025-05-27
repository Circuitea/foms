<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingsController extends Controller
{
    public function list(Request $request) {
        return Inertia::render('Meetings/ListMeetings');
    }

    public function new() {
        return Inertia::render('Meetings/NewMeeting');
    }

    public function create() {
        return redirect('/meetings');
    }
}
