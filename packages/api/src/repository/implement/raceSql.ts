// JRA・NARごとにSQLを分けて定義し、あとで共通化しやすい形にしてあります。

export const RaceSql = {
    JRA: {
        findAll: `
      SELECT race_id, place_id, race_type, date_time, location_code, race_number, created_at, updated_at FROM race WHERE race_type = 'JRA'
    `,
        findById: `
      SELECT race_id, place_id, race_type, date_time, location_code, race_number, created_at, updated_at FROM race WHERE race_type = 'JRA' AND race_id = ?
    `,
        // 他のJRA用クエリをここに追加
    },
    NAR: {
        findAll: `
      SELECT race_id, place_id, race_type, date_time, location_code, race_number, created_at, updated_at FROM race WHERE race_type = 'NAR'
    `,
        findById: `
      SELECT race_id, place_id, race_type, date_time, location_code, race_number, created_at, updated_at FROM race WHERE race_type = 'NAR' AND race_id = ?
    `,
        // 他のNAR用クエリをここに追加
    },
};
