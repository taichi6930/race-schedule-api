/**
 * レース開催情報のドメインモデルを定義する基本インターフェース
 *
 * このインターフェースは、個々のレース開催に関する基本的な
 * ドメインモデルの構造と振る舞いを定義します。主な特徴：
 * - イミュータブル（不変）なドメインモデル
 * - レース固有のビジネスルールの適用
 * - 開催場所データとの整合性保証
 *
 * ドメインモデルとしての責務：
 * - レース開催の基本情報の保持
 * - レースグレードの管理
 * - 開催日時の整合性検証
 * - レース固有の制約の適用
 *
 * 実装クラスは以下のような情報を含みます：
 * - レースID
 * - レース名
 * - 開催日時
 * - グレード
 * - 開催場所
 * - 距離
 * - その他のレース固有情報
 * @typeParam T - 実装クラス自身の型。自己参照型として使用され、
 *               型安全な継承を可能にします。
 *               例：class JraRaceData implements IRaceData<JraRaceData>
 */
export interface IRaceData<T extends IRaceData<T>> {
    /**
     * レース開催情報の部分的な更新を行い、新しいインスタンスを返します
     *
     * このメソッドは、イミュータブルな方法でレース情報を
     * 更新するために使用されます。更新時には以下の検証が行われます：
     * - レースの基本情報の妥当性
     * - 開催日時の範囲チェック
     * - グレードと条件の整合性
     * - 開催場所との関連性
     * @param partial - 更新したいフィールドを含むオブジェクト。
     *                Partial型により、一部のフィールドのみの指定が可能です。
     * @returns 更新された新しいレース情報インスタンス
     * @example
     * ```typescript
     * class MyRaceData implements IRaceData<MyRaceData> {
     *   constructor(
     *     public readonly id: string,
     *     public readonly name: string,
     *     public readonly dateTime: Date,
     *     public readonly grade: string
     *   ) {}
     *
     *   copy(partial: Partial<MyRaceData>): MyRaceData {
     *     return new MyRaceData(
     *       partial.id ?? this.id,
     *       partial.name ?? this.name,
     *       partial.dateTime ?? this.dateTime,
     *       partial.grade ?? this.grade
     *     );
     *   }
     * }
     * ```
     */
    copy: (partial: Partial<T>) => T;
}
