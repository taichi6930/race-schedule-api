import type { Database } from 'better-sqlite3';

import { JRA_PLACE_CSV_PATH, NAR_PLACE_CSV_PATH } from '../settings/constants';
import { CsvUtils } from './utils';

/**
 * CSVインポート用のマイグレーションクラス
 */
export class ImportCsvMigration {
    public constructor(private readonly db: Database) {}

    /**
     * 日付文字列をISO形式に変換
     * @param dateStr
     */
    private static parseDate(dateStr: string): string | undefined {
        try {
            const date = new Date(dateStr);
            if (Number.isNaN(date.getTime())) {
                return undefined;
            }
            return date.toISOString();
        } catch {
            return undefined;
        }
    }

    /**
     * NAR（地方競馬）の場所データをインポート
     */
    public importNarPlaceData(): void {
        try {
            const { rows } = CsvUtils.readCsvFile(NAR_PLACE_CSV_PATH);

            this.db.transaction(() => {
                const stmt = this.db.prepare(`
                    INSERT INTO place_data (id, race_type, datetime, location)
                    VALUES (@id, @raceType, @datetime, @location)
                `);

                for (const [id, dateTime, location] of rows) {
                    const parsedDate = ImportCsvMigration.parseDate(dateTime);
                    if (parsedDate === undefined) continue;

                    stmt.run({
                        id,
                        raceType: 'nar',
                        datetime: parsedDate,
                        location: location.replace(/'/g, "''"),
                    });
                }
            })();
        } catch (error) {
            console.error('NAR場所データのインポートに失敗:', error);
            throw error;
        }
    }

    /**
     * JRAの場所データをインポート
     */
    public importJraPlaceData(): void {
        try {
            const { rows } = CsvUtils.readCsvFile(JRA_PLACE_CSV_PATH);

            this.db.transaction(() => {
                const stmt = this.db.prepare(`
                    INSERT INTO place_data (id, race_type, datetime, location)
                    VALUES (@id, @raceType, @datetime, @location)
                `);

                for (const [id, dateTime, location] of rows) {
                    const parsedDate = ImportCsvMigration.parseDate(dateTime);
                    if (parsedDate === undefined) continue;

                    stmt.run({
                        id,
                        raceType: 'jra',
                        datetime: parsedDate,
                        location: location.replace(/'/g, "''"),
                    });
                }
            })();
        } catch (error) {
            console.error('JRA場所データのインポートに失敗:', error);
            throw error;
        }
    }
}
