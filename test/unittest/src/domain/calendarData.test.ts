import type { RaceType } from '../../../../packages/shared/src/types/raceType';
import { validateCalendarData } from '../../../../src/domain/calendarData';
import { testRaceTypeListAll } from '../mock/common/baseCommonData';

describe.each([testRaceTypeListAll])(
    'CalendarDataクラスのテスト(%s)',
    (raceType: RaceType) => {
        it('正しい入力でCalendarDataのインスタンスを作成できることを確認', () => {
            const calendarData = validateCalendarData({
                id: 'event1',
                raceType,
                title: 'イベントタイトル',
                startTime: '2024-08-12T09:00:00',
                endTime: '2024-08-12T10:00:00',
                location: '開催場',
                description: 'イベントの説明',
            });

            expect(calendarData.id).toBe('event1');
            expect(calendarData.raceType).toBe(raceType);
            expect(calendarData.title).toBe('イベントタイトル');
            expect(calendarData.startTime).toBe('2024-08-12T09:00:00');
            expect(calendarData.endTime).toBe('2024-08-12T10:00:00');
            expect(calendarData.location).toBe('開催場');
            expect(calendarData.description).toBe('イベントの説明');
        });

        it('copyメソッドが正常に動作することを確認', () => {
            const calendarData = validateCalendarData({
                id: 'event1',
                raceType,
                title: 'イベントタイトル',
                startTime: '2024-08-12T09:00:00',
                endTime: '2024-08-12T10:00:00',
                location: '開催場',
                description: 'イベントの説明',
            });
            const copiedCalendarData = {
                ...calendarData,
                title: 'イベントタイトル（コピー）',
            };
            expect(copiedCalendarData.id).toBe('event1');
            expect(copiedCalendarData.title).toBe('イベントタイトル（コピー）');
            expect(copiedCalendarData.startTime).toBe('2024-08-12T09:00:00');
            expect(copiedCalendarData.endTime).toBe('2024-08-12T10:00:00');
            expect(copiedCalendarData.location).toBe('開催場');
            expect(copiedCalendarData.description).toBe('イベントの説明');
        });

        it('copyメソッドが正常に動作することを確認2', () => {
            const calendarData = validateCalendarData({
                id: 'event1',
                raceType,
                title: 'イベントタイトル',
                startTime: '2024-08-12T09:00:00',
                endTime: '2024-08-12T10:00:00',
                location: '開催場',
                description: 'イベントの説明',
            });
            const copiedCalendarData = { ...calendarData };
            expect(copiedCalendarData.id).toBe('event1');
            expect(copiedCalendarData.title).toBe('イベントタイトル');
            expect(copiedCalendarData.startTime).toBe('2024-08-12T09:00:00');
            expect(copiedCalendarData.endTime).toBe('2024-08-12T10:00:00');
            expect(copiedCalendarData.location).toBe('開催場');
            expect(copiedCalendarData.description).toBe('イベントの説明');
        });

        it('文字列がundefinedの場合、空文字列に変換されることを確認', () => {
            const calendarData = validateCalendarData({
                id: '',
                raceType,
                title: '',
                startTime: '',
                endTime: '',
                location: '',
                description: '',
            });

            expect(calendarData.id).toBe('');
            expect(calendarData.title).toBe('');
            expect(calendarData.location).toBe('');
            expect(calendarData.description).toBe('');
        });
    },
);
