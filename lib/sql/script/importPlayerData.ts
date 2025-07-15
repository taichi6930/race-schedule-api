import path from 'node:path';

import Database from 'better-sqlite3';

import { ImportCsvMigration } from '../../src/utility/sqlite/migrations/importCsv';

/**
 * Playerデータのインポートスクリプト
 * このスクリプトは、CSVファイルからPlayerデータをSQLiteデータベースにインポートします。
 * 実行前に、CSVファイルのパスとデータベースのパスを確認してください。
 *
 * 使用方法:
 * 1. このファイルを実行する前に、必要なパッケgesをインストールしてください。
 *    `npm install better-sqlite3`
 * 2. CSVファイルのパスとデータベースのパスを適切に設定してください。
 * 3. 以下のコマンドでスクリプトを実行します:
 *    `pnpm ts-node lib/sql/script/importPlayerData.ts`
 */

// DBとCSVのパス
const dbPath = path.resolve(__dirname, '../../../volume/data/race-setting.db');
const csvPath = path.resolve(__dirname, '../csvData/playerData.csv');

const db = new Database(dbPath);
const migrator = new ImportCsvMigration(db);

migrator.importPlayerData(csvPath);

db.close();
console.log('playerData.csv のインポートが完了しました');
