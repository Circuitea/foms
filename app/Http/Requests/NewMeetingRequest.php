<?php

namespace App\Http\Requests;

use App\MeetingPriority;
use App\Models\MeetingType;
use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewMeetingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'type' => 'required|exists:'.MeetingType::class.',id',
            'priority' => ['required', Rule::enum(MeetingPriority::class)],
            'section' => 'required|exists:'.Section::class.',id',
            'description' => 'required|string|max:65535',
            
            'meetingFormat' => ['required', 'string', Rule::in(['in-person', 'zoom', 'google-meet'])],
            'meetingLocation' => 'exclude_unless:meetingFormat,in-person',
            'meetingLink' => 'exclude_if:meetingFormat,in-person',
            'meetingID' => 'exclude_unless:meetingFormat,zoom|nullable|string',
            'meetingPasscode' => 'exclude_unless:meetingFormat,zoom|nullable|string',

            'dateTime' => ['required', 'date', Rule::date()->afterToday()],
            'duration' => 'required|numeric|:0',

            'sendNotification' => 'required|boolean',

            'agendas' => 'required|list',
        ];
    }
}
