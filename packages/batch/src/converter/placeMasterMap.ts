import { CourseCodeType } from '@race-schedule/shared/src/types/courseCodeType';
import type { RaceType } from '@race-schedule/shared/src/types/raceType';
import { RaceCourseMasterList } from '@race-schedule/shared/src/utilities/course';

/**
 * placeName → placeCode のマッピングを生成
 * courseCodeType: OFFICIAL を使用
 */
const buildPlaceMasterMap = (): Map<string, string> => {
    const map = new Map<string, string>();
    for (const course of RaceCourseMasterList) {
        if (course.courseCodeType === CourseCodeType.OFFICIAL) {
            // キー: raceType_placeName → placeCode
            const key = `${course.raceType}_${course.placeName}`;
            map.set(key, course.placeCode);
        }
    }
    return map;
};

const placeMasterMap = buildPlaceMasterMap();

/**
 * raceType と placeName から locationCode を取得
 * @param raceType レース種別
 * @param placeName 開催場名
 * @returns locationCode（見つからない場合は placeName の先頭2文字をコード化）
 */
export const getLocationCode = (
    raceType: RaceType,
    placeName: string,
): string => {
    const key = `${raceType}_${placeName}`;
    const code = placeMasterMap.get(key);
    if (code) {
        return code;
    }
    // マスターに見つからない場合は placeName をそのままコードとして返す
    console.warn(
        `Location code not found for: ${key}, using placeName as code`,
    );
    return placeName;
};
