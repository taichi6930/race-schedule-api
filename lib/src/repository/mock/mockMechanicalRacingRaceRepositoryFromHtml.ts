import { RaceData } from '../../../../src/domain/raceData';
import type { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../src/repository/entity/raceEntity';
import { RaceType } from '../../../../src/utility/raceType';
import type { RaceStage } from '../../../../src/utility/validateAndType/raceStage';
import { baseRacePlayerDataList } from '../../../../test/unittest/src/mock/common/baseCommonData';

class SearchRaceFilterEntityForAWS {
    public constructor(
        public readonly startDate: Date,
        public readonly finishDate: Date,
        public readonly raceType: RaceType,
        public readonly placeEntityList: PlaceEntity[],
    ) {}
}

/**
 * レース開催データの永続化を担当するリポジトリインターフェース
 *
 * このインターフェースは、レース開催データの永続化層とドメイン層を
 * 橋渡しする役割を果たします。主な責務：
 * - レース開催データの検索・取得
 * - レース開催データの保存・更新
 *
 * レースデータは開催場所データと密接に関連しており：
 * - レースは必ず特定の開催場所で行われる
 * - 開催場所の情報を参照してレース情報を補完
 * - 開催場所による検索・フィルタリングが可能
 *
 * リポジトリパターンに基づき、以下の特徴を持ちます：
 * - データストアの詳細を隠蔽
 * - トランザクション管理
 * - エンティティの集約管理
 *
 * 実装クラスは以下のようなデータストアに対応できます：
 * - ストレージ（S3, ローカルファイルなど）
 * - データベース（SQLite, RDBMSなど）
 * - 外部API（HTMLスクレイピングなど）
 */
interface IRaceRepositoryForAWS {
    /**
     * 指定された検索条件に基づいてレース開催データを取得します
     *
     * このメソッドは以下の処理を行います：
     * 1. 検索フィルターに基づいてクエリを構築
     * 2. データストアに対してクエリを実行
     * 3. 取得したデータをエンティティに変換
     * 4. 関連する開催場所情報を紐付け
     * @param searchFilter - 検索条件を指定するフィルターエンティティ
     * - 開始日・終了日による期間指定
     * - 開催場所による絞り込み
     * - グレードによる絞り込み
     * - その他の検索条件
     * @returns レース開催エンティティの配列。該当データがない場合は空配列
     * @throws Error データの取得に失敗した場合
     */
    fetchRaceEntityList: (
        searchFilter: SearchRaceFilterEntityForAWS,
    ) => Promise<RaceEntity[]>;

    /**
     * レース開催データを一括で登録/更新します
     *
     * このメソッドは以下の処理を行います：
     * 1. 既存データの有無を確認
     * 2. データの整合性をチェック（開催場所の存在確認など）
     * 3. 一括でデータを保存/更新
     * @param raceEntityList - 登録/更新するレース開催エンティティの配列
     * @throws Error 以下の場合にエラーが発生：
     *               - データの整合性チェックに失敗（存在しない開催場所の参照など）
     *               - データストアへの書き込みに失敗
     *               - 一意制約違反が発生（重複するレースIDなど）
     */
    upsertRaceEntityList: (
        raceType: RaceType,
        raceEntityList: RaceEntity[],
    ) => Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }>;
}

// MechanicalRacingRaceRepositoryFromHtmlのモックを作成
export class MockMechanicalRacingRaceRepositoryFromHtml
    implements IRaceRepositoryForAWS
{
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntityForAWS,
    ): Promise<RaceEntity[]> {
        const { placeEntityList } = searchFilter;
        const raceEntityList: RaceEntity[] = [];
        for (const placeEntity of placeEntityList) {
            const { placeData, grade } = placeEntity;
            const { raceType, location, dateTime } = placeData;
            // 1から12までのレースを作成
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                const raceDate = new Date(dateTime);
                raceDate.setHours(raceNumber + 9, 0, 0, 0);
                raceEntityList.push(
                    RaceEntity.createWithoutId(
                        RaceData.create(
                            raceType,
                            `${raceType}${location}第${raceNumber.toString()}R`,
                            raceDate,
                            location,
                            grade,
                            raceNumber,
                        ),
                        undefined, // heldDayDataは未設定
                        undefined, // conditionDataは未設定
                        this.createStage(raceType, raceNumber),
                        baseRacePlayerDataList(raceType),
                    ),
                );
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    public async upsertRaceEntityList(
        raceType: RaceType,
        raceEntityList: RaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }> {
        console.debug(raceType, raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    private createStage(raceType: RaceType, raceNumber: number): RaceStage {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return raceNumber === 12 ? 'S級決勝' : 'S級予選';
            }
            case RaceType.BOATRACE: {
                return raceNumber === 12 ? '優勝戦' : '一般戦';
            }
            case RaceType.AUTORACE:
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }
}
