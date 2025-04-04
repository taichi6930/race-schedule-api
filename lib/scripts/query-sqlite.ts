import 'reflect-metadata';
import '../container/repository';

import { container } from 'tsyringe';

import { SearchPlaceFilterEntity } from '../src/repository/entity/searchPlaceFilterEntity';
import type { NarPlaceRepositoryFromSqliteImpl } from '../src/repository/implement/narPlaceRepositoryFromSqliteImpl';

/**
 * データベースのクエリ実行
 */
const queryDatabase = async (): Promise<void> => {
    const repository =
        container.resolve<NarPlaceRepositoryFromSqliteImpl>(
            'NarPlaceRepository',
        );

    const searchFilter = new SearchPlaceFilterEntity(
        new Date('2025-04-01'),
        new Date('2025-04-30'),
    );

    console.log('開催データを検索します...');
    const results = await repository.fetchPlaceEntityList(searchFilter);

    console.log('\n検索結果:');
    console.log('-'.repeat(50));
    for (const entity of results) {
        console.log(`ID: ${entity.id}`);
        console.log(
            `日時: ${entity.placeData.dateTime.toLocaleString('ja-JP')}`,
        );
        console.log(`場所: ${entity.placeData.location}`);
        console.log(`更新日時: ${entity.updateDate.toLocaleString('ja-JP')}`);
        console.log('-'.repeat(50));
    }

    console.log(`\n合計: ${results.length}件のデータが見つかりました`);
};

/**
 * メインの実行関数
 */
const main = async (): Promise<void> => {
    try {
        await queryDatabase();
    } catch (error: unknown) {
        console.error('クエリの実行に失敗しました:', error);
    }
};

// スクリプトの実行
void main();
