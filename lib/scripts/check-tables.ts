import 'reflect-metadata';

import { withDatabase } from '../src/utility/sqlite';

type SqliteRow = Record<string, string>;

const checkTables = (): void => {
    console.log('テーブルの内容を確認します...');

    withDatabase((db) => {
        // place_schedulesテーブルの確認
        console.log('\nplace_schedulesテーブルの内容:');
        console.log('-'.repeat(50));
        const placeSchedules = db
            .prepare('SELECT * FROM place_schedules')
            .all() as SqliteRow[];

        for (const row of placeSchedules) {
            for (const [key, value] of Object.entries(row)) {
                console.log(`${key}: ${value}`);
            }
            console.log('-'.repeat(50));
        }

        // 合計件数の表示
        console.log('\n集計:');
        console.log(`スケジュール: ${placeSchedules.length}件`);
    });
};

// スクリプトの実行
try {
    checkTables();
} catch (error: unknown) {
    console.error('テーブル確認に失敗しました:', error);
}
