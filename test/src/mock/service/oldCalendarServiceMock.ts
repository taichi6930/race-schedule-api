import type { IRaceEntity } from '../../../../lib/src/repository/entity/iRaceEntity';
import type { IOldCalendarService } from '../../../../lib/src/service/interface/IOldCalendarService';

/**
 * CalendarServiceのモックを作成する
 * @returns モック化されたICalendarServiceインターフェースのインスタンス
 */
export const oldCalendarServiceMock = <R extends IRaceEntity<R>>(): jest.Mocked<
    IOldCalendarService<R>
> => {
    return {
        upsertEvents: jest.fn().mockResolvedValue(Promise.resolve()),
    };
};
