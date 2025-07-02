<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewMeetingRequest;
use App\Models\Meeting;
use App\Models\MeetingType;
use App\Models\Section;
use App\PermissionsEnum;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MeetingsController extends Controller
{
    public function list(Request $request) {
        if (Gate::none([PermissionsEnum::MEETINGS_READ_SELF, PermissionsEnum::MEETINGS_READ])) {
            abort(403);
        }

        return Inertia::render('Meetings/ListMeetings');
    }

    public function new() {
        Gate::authorize(PermissionsEnum::MEETINGS_CREATE);

        return Inertia::render('Meetings/NewMeeting', [
            'sections' => Section::all(),
            'types' => MeetingType::all(),
        ]);
    }

    public function create(NewMeetingRequest $request) {
        Gate::authorize(PermissionsEnum::MEETINGS_CREATE);

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

        
        $formatClass = Relation::getMorphedModel($validated['meetingFormat']);
        $format = new $formatClass();
        
        if ($validated['meetingFormat'] == 'in_person_meeting') {
            $format->fill(['meeting_location' => $validated['meetingLocation']]);
        } else if ($validated['meetingFormat'] == 'google_meeting') {
            $format->fill(['meeting_link' => $validated['meetingLink']]);
        } else if ($validated['meetingFormat'] == 'zoom_meeting') {
            $format->fill([
                'meeting_link' => $validated['meetingLink'],
                'meeting_id' => $validated['meetingID'],
                'meeting_passcode' => $validated['meetingPasscode'],
            ]);
        }
        
        $format->save();

        $newMeeting->format_type = $validated['meetingFormat'];
        $newMeeting->format_id = $format->id;
        
        $agendas = collect($validated['agendas'])->map(function (string $agenda, int $index) {
            return ['agenda' => $agenda, 'order' => $index];
        });
        
        $newMeeting->save();

        $newMeeting->agendas()->createMany($agendas);

        return redirect('/meetings/' . $newMeeting->id);
    }

    public function show(Request $request, int $id) {
        $meeting = Meeting::with(['agendas', 'format', 'section', 'type'])->findOrFail($id);
        return Inertia::render('Meetings/ShowMeeting', [
            'meeting' => $meeting,
        ]);
    }
}
