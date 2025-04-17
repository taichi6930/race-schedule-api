import type { calendar_v3 } from 'googleapis';

/**
 * レース開催エンティティの基本インターフェース
 *
 * このインターフェースは、レース開催に関する基本的な情報と
 * 操作を定義します。主な特徴：
 * - イミュータブル（不変）なデータ構造
 * - 一意のID管理
 * - データ形式の変換機能（Record形式、Googleカレンダー形式）
 * - 型安全な部分更新機能
 *
 * このインターフェースを実装するエンティティは、以下のような
 * レース開催に関する情報を保持します：
 * - レースID
 * - レース名
 * - 開催日時
 * - 開催場所
 * - グレード
 * - 距離
 * など
 *
 * @typeParam T - 実装クラス自身の型。自己参照型として使用され、
 *               型安全な継承を可能にします。
 *               例：class JraRaceEntity implements IRaceEntity<JraRaceEntity>
 */
export interface IRaceEntity<T extends IRaceEntity<T>> {
    /**
     * レースの一意識別子
     *
     * このIDは通常、以下の情報を組み合わせて生成されます：
     * - 開催日（YYYYMMDD形式）
     * - 開催場所コード
     * - レース番号
     *
     * @readonly イミュータブルな設計を保証するため、読み取り専用
     */
    readonly id: string;

    /**
     * エンティティの部分的な更新を行い、新しいインスタンスを返します
     *
     * @param partial - 更新したいフィールドを含むオブジェクト
     * @returns 更新された新しいエンティティインスタンス
     * @example
     * ```typescript
     * const newEntity = entity.copy({ raceName: "新しいレース名" });
     * ```
     */
    copy: (partial: Partial<T>) => T;

    /**
     * エンティティをストレージ用のRecord形式に変換します
     *
     * このメソッドは、エンティティをデータベースやファイルに
     * 保存する際のフォーマットに変換します。
     *
     * @returns ストレージ用のプレーンオブジェクト
     */
    toRaceRecord: () => object;

    /**
     * エンティティをGoogleカレンダーのイベント形式に変換します
     *
     * このメソッドは、レース情報をGoogleカレンダーに登録する際の
     * フォーマットに変換します。変換される情報には以下が含まれます：
     * - イベントのタイトル（レース名）
     * - 開催日時
     * - 場所
     * - 説明（レースの詳細情報）
     *
     * @returns Googleカレンダーのイベントデータ
     */
    toGoogleCalendarData: () => calendar_v3.Schema$Event;
}
