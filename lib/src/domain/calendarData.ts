import type { RaceType } from '../utility/raceType';


export class CalendarData {
    
    private constructor(
        public readonly id: string,
        public readonly raceType: RaceType,
        public readonly title: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly location: string,
        public readonly description: string,
    ) {}

    
    public static create(
        id: string | null | undefined,
        raceType: RaceType,
        title: string | null | undefined,
        startTime: string | null | undefined,
        endTime: string | null | undefined,
        location: string | null | undefined,
        description: string | null | undefined,
    ): CalendarData {
        return new CalendarData(
            id ?? '',
            raceType,
            title ?? '',
            startTime ? new Date(startTime) : new Date(0),
            endTime ? new Date(endTime) : new Date(0),
            location ?? '',
            description ?? '',
        );
    }

    
    public copy(partial: Partial<CalendarData> = {}): CalendarData {
        return new CalendarData(
            partial.id ?? this.id,
            partial.raceType ?? this.raceType,
            partial.title ?? this.title,
            partial.startTime ?? this.startTime,
            partial.endTime ?? this.endTime,
            partial.location ?? this.location,
            partial.description ?? this.description,
        );
    }
}
