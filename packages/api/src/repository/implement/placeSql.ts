// JRA・NARごとにSQLを分けて定義し、あとで共通化しやすい形にしてあります。

export const PlaceSql = {
    JRA: {
        findAll: `
      SELECT place_id, race_type, date_time, location_code, created_at, updated_at FROM place WHERE organization = 'JRA'
    `,
        findById: `
      SELECT place_id, race_type, date_time, location_code, created_at, updated_at FROM place WHERE organization = 'JRA' AND place_id = ?
    `,
        // 他のJRA用クエリをここに追加
    },
    NAR: {
        findAll: `
      SELECT place_id, race_type, date_time, location_code, created_at, updated_at FROM place WHERE organization = 'NAR'
    `,
        findById: `
      SELECT place_id, race_type, date_time, location_code, created_at, updated_at FROM place WHERE organization = 'NAR' AND place_id = ?
    `,
        // 他のNAR用クエリをここに追加
    },
};
