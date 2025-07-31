import { CalendarData } from '../../../lib/src/domain/calendarData';
import { RaceType } from '../../../lib/src/utility/racetype';

describe('CalendarDataクラスのテスト', () => {
    it('正しい入力でCalendarDataのインスタンスを作成できることを確認', () => {
        const calendarData = CalendarData.create(
            'event1',
            RaceType.JRA,
            'イベントタイトル',
            '2024-08-12T09:00:00',
            '2024-08-12T10:00:00',
            '東京',
            'イベントの説明',
        );

        expect(calendarData.id).toBe('event1');
        expect(calendarData.raceType).toBe(RaceType.JRA);
        expect(calendarData.title).toBe('イベントタイトル');
        expect(calendarData.startTime).toEqual(new Date('2024-08-12T09:00:00'));
        expect(calendarData.endTime).toEqual(new Date('2024-08-12T10:00:00'));
        expect(calendarData.location).toBe('東京');
        expect(calendarData.description).toBe('イベントの説明');
    });

    it('copyメソッドが正常に動作することを確認', () => {
        const calendarData = CalendarData.create(
            'event1',
            RaceType.JRA,
            'イベントタイトル',
            '2024-08-12T09:00:00',
            '2024-08-12T10:00:00',
            '東京',
            'イベントの説明',
        );

        const copiedCalendarData = calendarData.copy({
            title: 'イベントタイトル（コピー）',
        });
        expect(copiedCalendarData.id).toBe('event1');
        expect(copiedCalendarData.title).toBe('イベントタイトル（コピー）');
        expect(copiedCalendarData.startTime).toEqual(
            new Date('2024-08-12T09:00:00'),
        );
        expect(copiedCalendarData.endTime).toEqual(
            new Date('2024-08-12T10:00:00'),
        );
        expect(copiedCalendarData.location).toBe('東京');
        expect(copiedCalendarData.description).toBe('イベントの説明');
    });

    it('copyメソッドが正常に動作することを確認2', () => {
        const calendarData = CalendarData.create(
            'event1',
            RaceType.JRA,
            'イベントタイトル',
            '2024-08-12T09:00:00',
            '2024-08-12T10:00:00',
            '東京',
            'イベントの説明',
        );

        const copiedCalendarData = calendarData.copy();
        expect(copiedCalendarData.id).toBe('event1');
        expect(copiedCalendarData.title).toBe('イベントタイトル');
        expect(copiedCalendarData.startTime).toEqual(
            new Date('2024-08-12T09:00:00'),
        );
        expect(copiedCalendarData.endTime).toEqual(
            new Date('2024-08-12T10:00:00'),
        );
        expect(copiedCalendarData.location).toBe('東京');
        expect(copiedCalendarData.description).toBe('イベントの説明');
    });

    it('文字列がundefinedの場合、空文字列に変換されることを確認', () => {
        const calendarData = CalendarData.create(
            undefined,
            RaceType.JRA,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        );

        expect(calendarData.id).toBe('');
        expect(calendarData.title).toBe('');
        // expect(calendarData.startTime).toEqual(new Date(''));
        // expect(calendarData.endTime).toEqual(new Date(''));
        expect(calendarData.location).toBe('');
        expect(calendarData.description).toBe('');
    });
});
