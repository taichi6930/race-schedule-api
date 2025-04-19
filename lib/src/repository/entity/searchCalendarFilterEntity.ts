/**
 *
 */
export class SearchCalendarFilterEntity {
    /**
     *
     * @param startDate
     * @param finishDate
     */
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
    ) {}
}
