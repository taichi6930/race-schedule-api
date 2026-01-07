export class PlaceMasterEntity {
    private constructor(
        public readonly raceType: string,
        public readonly courseCodeType: string,
        public readonly placeName: string,
        public readonly placeCode: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    public static create(params: {
        raceType: string;
        courseCodeType: string;
        placeName: string;
        placeCode: string;
        createdAt: Date;
        updatedAt: Date;
    }): PlaceMasterEntity {
        return new PlaceMasterEntity(
            params.raceType,
            params.courseCodeType,
            params.placeName,
            params.placeCode,
            params.createdAt,
            params.updatedAt,
        );
    }
}
