import { ImportCsvMigration } from '../src/utility/sqlite/migrations/importCsv';
import { setupDatabase } from '../src/utility/sqlite/settings/dbConfig';

/**
 * CSVデータをインポートする
 */
const importCsvData = (): void => {
    let db = undefined;

    try {
        console.log('CSVデータのインポートを開始します...');

        db = setupDatabase();
        const importer = new ImportCsvMigration(db);

        const args = process.argv.slice(2);
        const importType = args[0]?.toLowerCase();

        switch (importType) {
            case 'nar': {
                console.log('NAR（地方競馬）のデータをインポートします...');
                importer.importNarPlaceData();
                break;
            }
            case 'jra': {
                console.log('JRAのデータをインポートします...');
                importer.importJraPlaceData();
                break;
            }
            case 'all': {
                console.log('全ての競馬場データをインポートします...');
                importer.importNarPlaceData();
                importer.importJraPlaceData();
                break;
            }
            default: {
                console.error('使用方法: pnpm run db:import [nar|jra|all]');
            }
        }

        console.log('データのインポートが完了しました。');
    } catch (error) {
        console.error('データのインポート中にエラーが発生しました:', error);
        throw error;
    } finally {
        db?.close();
    }
};

importCsvData();
