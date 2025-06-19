<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewMeetingRequest;
use App\MeetingPriority;
use App\Models\GoogleMeeting;
use App\Models\InPersonMeeting;
use App\Models\Meeting;
use App\Models\MeetingType;
use App\Models\Section;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;

class MeetingsController extends Controller
{
    public function list(Request $request) {
        return Inertia::render('Meetings/ListMeetings');
    }

    public function new() {
        return Inertia::render('Meetings/NewMeeting', [
            'sections' => Section::all(),
            'types' => MeetingType::all(),
            'priorityLevels' => MeetingPriority::cases(),
        ]);
    }

    public function create(NewMeetingRequest $request) {
        $validated = $request->validated();

        $newMeeting = new Meeting();

        $newMeeting->fill([
            'title' => $validated['title'],
            'priority' => $validated['priority'],
            'description' => $validated['description'],
            'schedule' => Date::parse($validated['dateTime'])->format('Y-m-d H:m:s'),
            'duration' => $validated['duration'],
        ]);

        $newMeeting->type()->associate(MeetingType::find($validated['type']));
        $newMeeting->section()->associate(Section::find($validated['section']));;

        if ($validated['meetingFormat'] == 'in-person') {
            $format = InPersonMeeting::create(['meeting_location' => $validated['meetingLocation']]);
            $newMeeting->format_type = $format->getMorphClass();
            $newMeeting->format_id = $format->id;
        } else if ($validated['meetingFormat'] == 'google-meet') {
            $format = GoogleMeeting::create(['meeting_link' => $validated['meetingLink']]);
            $newMeeting->format_type = $format->getMorphClass();
            $newMeeting->format_id = $format->id;
        } else if ($validated['meetingFormat'] == 'zoom') {
            $format = ZoomMeeting::create([
                'meeting_link' => $validated['meetingLink'],
                'meeting_id' => $validated['meetingID'],
                'meeting_passcode' => $validated['meetingPasscode'],
            ]);
            $newMeeting->format_type = $format->getMorphClass();
            $newMeeting->format_id = $format->id;
        }

        $agendas = collect($validated['agendas'])->map(function (string $agenda, int $index) {
            return ['agenda' => $agenda, 'order' => $index];
        });

        $newMeeting->save();

        $newMeeting->agendas()->createMany($agendas);

        return redirect("/meetings/");
        // return response()->json($request->validated());
    }
}
