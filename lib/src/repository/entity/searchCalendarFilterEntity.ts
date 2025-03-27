export class SearchCalendarFilterEntity {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {}
}
