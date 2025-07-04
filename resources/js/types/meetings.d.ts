import { Personnel, Section } from ".";

export interface MeetingType {
    id: number,
    name: string,
}

export type MeetingPriority = 'normal' | 'urgent';

export interface MeetingAgenda {
    id: number,
    order: number,
    agenda: string,
}

export type MeetingFormatType = 'in_person_meeting' | 'zoom_meeting' | 'google_meeting';

export interface Meeting {
    id: number,
    title: string,
    type: MeetingType,
    priority: MeetingPriority,
    section: Section,
    description: string,

    format_type: MeetingFormatType,
    format: {
        meeting_location?: string,
        meeting_link?: string,
        meeting_id?: string,
        meeting_passcode?: string,
    }

    schedule: string,
    duration: number,

    agendas: MeetingAgenda[],

    organizer: Personnel,

    created_at: string,
    updated_at: string,

}