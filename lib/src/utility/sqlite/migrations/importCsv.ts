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
     * @param dateStr - 変換する日付文字列
     * @returns ISO形式の日付文字列、または変換失敗時はundefined
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
                    ON CONFLICT(id) DO UPDATE SET
                        datetime = excluded.datetime,
                        location = excluded.location,
                        updated_at = DATETIME('now', 'localtime')
                    WHERE datetime != excluded.datetime
                       OR location != excluded.location
                `);

                let inserted = 0;
                let updated = 0;

                for (const [id, dateTime, location] of rows) {
                    const parsedDate = ImportCsvMigration.parseDate(dateTime);
                    if (parsedDate === undefined) continue;

                    const result = stmt.run({
                        id,
                        raceType: 'nar',
                        datetime: parsedDate,
                        location: location.replace(/'/g, "''"),
                    });

                    if (result.changes > 0) {
                        if (result.lastInsertRowid) {
                            inserted++;
                        } else {
                            updated++;
                        }
                    }
                }

                console.log(
                    `NAR場所データ: ${inserted}件挿入, ${updated}件更新`,
                );
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

            // 場所データのインポート
            this.db.transaction(() => {
                const stmt = this.db.prepare(`
                    INSERT INTO place_data (id, race_type, datetime, location)
                    VALUES (@id, @raceType, @datetime, @location)
                    ON CONFLICT(id) DO UPDATE SET
                        datetime = excluded.datetime,
                        location = excluded.location,
                        updated_at = DATETIME('now', 'localtime')
                    WHERE datetime != excluded.datetime
                       OR location != excluded.location
                `);

                const stmtHeld = this.db.prepare(`
                    INSERT INTO place_held_data (id, race_type, held_times, held_day_times)
                    VALUES (@id, @raceType, @heldTimes, @heldDayTimes)
                    ON CONFLICT(id) DO UPDATE SET
                        held_times = excluded.held_times,
                        held_day_times = excluded.held_day_times,
                        updated_at = DATETIME('now', 'localtime')
                    WHERE held_times != excluded.held_times
                       OR held_day_times != excluded.held_day_times
                `);

                let inserted = 0;
                let updated = 0;

                let heldInserted = 0;
                let heldUpdated = 0;

                for (const row of rows) {
                    const [id, dateTime, location, heldTimes, heldDayTimes] =
                        row;
                    if (
                        !id ||
                        !dateTime ||
                        !location ||
                        !heldTimes ||
                        !heldDayTimes
                    )
                        continue;
                    const parsedDate = ImportCsvMigration.parseDate(dateTime);
                    if (parsedDate === undefined) continue;

                    const result = stmt.run({
                        id,
                        raceType: 'jra',
                        datetime: parsedDate,
                        location: location.replace(/'/g, "''"),
                    });

                    if (result.changes > 0) {
                        if (result.lastInsertRowid) {
                            inserted++;
                        } else {
                            updated++;
                        }
                    }

                    const heldResult = stmtHeld.run({
                        id,
                        raceType: 'jra',
                        heldTimes: Number(heldTimes),
                        heldDayTimes: Number(heldDayTimes),
                    });

                    if (heldResult.changes > 0) {
                        if (heldResult.lastInsertRowid) {
                            heldInserted++;
                        } else {
                            heldUpdated++;
                        }
                    }
                }

                console.log(
                    `JRA場所データ: ${inserted}件挿入, ${updated}件更新`,
                );
                console.log(
                    `JRA開催回数データ: ${heldInserted}件挿入, ${heldUpdated}件更新`,
                );
            })();
        } catch (error) {
            console.error('JRA場所データのインポートに失敗:', error);
            throw error;
        }
    }

    /**
     * playerData.csv を player_data テーブルにインポート
     * @param csvPath - インポートするCSVファイルのパス
     */
    public importPlayerData(csvPath: string): void {
        try {
            const { rows } = CsvUtils.readCsvFile(csvPath);
            const stmt = this.db.prepare(`
                INSERT INTO player_data (id, raceType, playerNumber, name, priority)
                VALUES (@id, @raceType, @playerNumber, @name, @priority)
                ON CONFLICT(id) DO UPDATE SET
                    raceType = excluded.raceType,
                    playerNumber = excluded.playerNumber,
                    name = excluded.name,
                    priority = excluded.priority,
                    updated_at = DATETIME('now', 'localtime')
                WHERE raceType != excluded.raceType
                   OR playerNumber != excluded.playerNumber
                   OR name != excluded.name
                   OR priority != excluded.priority
            `);

            let inserted = 0;
            let updated = 0;

            // 1行目はヘッダーなのでスキップ済み
            for (const row of rows) {
                const [id, raceType, playerNumber, name, priority] = row;
                if (!id || !raceType || !playerNumber || !name || !priority) {
                    continue;
                }
                const result = stmt.run({
                    id,
                    raceType,
                    playerNumber,
                    name,
                    priority: Number(priority),
                });
                if (result.changes > 0) {
                    if (result.lastInsertRowid) {
                        inserted++;
                    } else {
                        updated++;
                    }
                }
            }
            console.log(`player_data: ${inserted}件挿入, ${updated}件更新`);
        } catch (error) {
            console.error('player_dataのインポートに失敗:', error);
            throw error;
        }
    }
}
