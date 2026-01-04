import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * 決定表
 *
 * | ケースID | 入力 `courseCodeTypeList` | リポジトリの挙動（stub mock） | 期待結果 |
 * |---|---:|---|---|
 * | C1 | `[]` | リポジトリに `[]` を返すよう設定 | サービスは `[]` を返す |
 * | C2 | `[typeA]` | リポジトリが該当コース1件を返す | その配列を返す |
 * | C3 | `[typeA,typeB]` | リポジトリが複数件を返す | 返ってきた配列を返す |
 * | C4 | 任意 | リポジトリが例外を投げる | 例外を伝播する |
 */
import type { Course } from '../../shared/src/types/course';
import { CourseCodeType } from '../../shared/src/types/courseCodeType';
import { RaceType } from '../../shared/src/types/raceType';
import type { ICourseRepository } from '../src/repository/interface/ICourseRepository';
import { CourseService } from '../src/service/implement/courseService';

describe('CourseService#fetch', () => {
    let repo: ICourseRepository & { findAllByCourseCodeTypeList: any };
    let service: CourseService;

    const allCourses: Course[] = [
        {
            raceType: RaceType.JRA,
            courseCodeType: CourseCodeType.OFFICIAL,
            placeName: 'A',
            placeCode: 'A',
        },
        {
            raceType: RaceType.JRA,
            courseCodeType: CourseCodeType.NETKEIBA,
            placeName: 'B',
            placeCode: 'B',
        },
    ];

    beforeEach(() => {
        repo = {
            findAllByCourseCodeTypeList: vi.fn(),
        } as unknown as ICourseRepository & {
            findAllByCourseCodeTypeList: any;
        };

        service = new CourseService(repo);
    });

    it('C1: 空配列の場合は全てのコース種別で取得する', async () => {
        (repo.findAllByCourseCodeTypeList as any).mockResolvedValue([]);

        const result = await service.fetch([]);

        expect(repo.findAllByCourseCodeTypeList).toHaveBeenCalledWith([]);
        expect(result).toEqual([]);
    });

    it('C2: 単一種別でフィルタされた結果を返す', async () => {
        const filtered = [allCourses[0]];
        (repo.findAllByCourseCodeTypeList as any).mockResolvedValue(filtered);

        const result = await service.fetch([CourseCodeType.OFFICIAL]);

        expect(repo.findAllByCourseCodeTypeList).toHaveBeenCalledWith([
            CourseCodeType.OFFICIAL,
        ]);
        expect(result).toEqual(filtered);
    });

    it('C3: 複数種別でフィルタされた結果を返す', async () => {
        (repo.findAllByCourseCodeTypeList as any).mockResolvedValue(allCourses);

        const result = await service.fetch([
            CourseCodeType.OFFICIAL,
            CourseCodeType.NETKEIBA,
        ]);

        expect(repo.findAllByCourseCodeTypeList).toHaveBeenCalledWith([
            CourseCodeType.OFFICIAL,
            CourseCodeType.NETKEIBA,
        ]);
        expect(result).toEqual(allCourses);
    });

    it('C4: リポジトリが例外を投げたら例外を伝播する', async () => {
        const err = new Error('db error');
        (repo.findAllByCourseCodeTypeList as any).mockRejectedValue(err);

        await expect(
            service.fetch([CourseCodeType.OFFICIAL]),
        ).rejects.toThrowError(err);
    });
});
