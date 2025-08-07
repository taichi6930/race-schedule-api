import { NarRaceEntity } from '../../../../../lib/src/repository/entity/narRaceEntity';
import {
    baseNarGoogleCalendarData,
    baseNarRaceData,
    baseNarRaceEntity,
    baseNarRaceRecord,
} from '../../mock/common/baseNarData';

describe('NarRaceEntityクラスのテスト', () => {
    /**
     * テスト用のNarRaceEntityインスタンス
     */
    const baseRaceEntity = baseNarRaceEntity;

    it('正しい入力でNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('nar202412294411');
        expect(raceEntity.raceData).toBe(baseNarRaceData);
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const copiedRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(raceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const { raceData } = raceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseNarRaceData);
    });

    it('NarRaceEntityのインスタンスをGoogleカレンダーのイベントに変換できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const googleCalendarData = raceEntity.toGoogleCalendarData(
            new Date('2025-01-01T12:00:00.000Z'),
        );
        // Googleカレンダーのイベントが正しいか確認
        expect(googleCalendarData).toEqual(baseNarGoogleCalendarData);
    });

    it('NarRaceEntityのインスタンスをNarRaceRecordに変換できることを確認', () => {
        const raceEntity = baseNarRaceEntity;
        const raceRecord = raceEntity.toRaceRecord();
        // NarRaceRecordが正しいか確認
        expect(raceRecord).toEqual(baseNarRaceRecord);
    });

    // it('GoogleカレンダーのイベントからNarRaceEntityのインスタンスを作成できることを確認', () => {
    //     const raceEntity = baseNarRaceEntity;
    //     const googleCalendarData = raceEntity.toGoogleCalendarData(
    //         new Date('2025-01-01T12:00:00.000Z'),
    //     );
    //     const copiedRaceEntity =
    //         NarRaceEntity.fromGoogleCalendarDataToRaceEntity(
    //             googleCalendarData,
    //         );
    //     // インスタンスが正しいか確認
    //     expect(copiedRaceEntity).toEqual(raceEntity);
    // });

    it('GoogleカレンダーのイベントからCalendarDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseNarRaceEntity;
        const googleCalendarData = raceEntity.toGoogleCalendarData(
            new Date('2025-01-01T12:00:00.000Z'),
        );
        const calendarData =
            NarRaceEntity.fromGoogleCalendarDataToCalendarData(
                googleCalendarData,
            );
        // CalendarDataが正しいか確認
        expect(calendarData.id).toBe(googleCalendarData.id);
        expect(calendarData.title).toBe(googleCalendarData.summary);
        expect(calendarData.startTime).toEqual(
            new Date(googleCalendarData.start?.dateTime ?? ''),
        );
        expect(calendarData.endTime).toEqual(
            new Date(googleCalendarData.end?.dateTime ?? ''),
        );
        expect(calendarData.location).toBe(googleCalendarData.location);
        expect(calendarData.description).toBe(googleCalendarData.description);
    });
});
