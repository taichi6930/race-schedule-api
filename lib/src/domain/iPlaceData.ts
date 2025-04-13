/**
 * レース開催場所のドメインモデルを定義する基本インターフェース
 *
 * このインターフェースは、レース開催場所に関する基本的な
 * ドメインモデルの構造と振る舞いを定義します。主な特徴：
 * - イミュータブル（不変）なドメインモデル
 * - ドメインロジックのカプセル化
 * - 型安全な更新操作の保証
 *
 * ドメインモデルとしての責務：
 * - 開催場所の基本情報の保持
 * - ビジネスルールの適用
 * - データの整合性の保証
 *
 * 実装クラスは以下のような情報を含みます：
 * - 開催場所ID
 * - 開催日程
 * - 開催場所名
 * - その他の付随情報
 *
 * @typeParam T - 実装クラス自身の型。自己参照型として使用され、
 *               型安全な継承を可能にします。
 *               例：class JraPlaceData implements IPlaceData<JraPlaceData>
 */
export interface IPlaceData<T extends IPlaceData<T>> {
    /**
     * ドメインモデルの部分的な更新を行い、新しいインスタンスを返します
     *
     * このメソッドは、イミュータブルな方法でドメインモデルを
     * 更新するために使用されます。更新時にはドメインのビジネス
     * ルールが適用され、データの整合性が保証されます。
     *
     * @param partial - 更新したいフィールドを含むオブジェクト。
     *                Partial型により、一部のフィールドのみの指定が可能です。
     * @returns 更新された新しいドメインモデルインスタンス
     *
     * @example
     * ```typescript
     * class MyPlaceData implements IPlaceData<MyPlaceData> {
     *   constructor(
     *     public readonly id: string,
     *     public readonly name: string,
     *     public readonly date: Date
     *   ) {}
     *
     *   copy(partial: Partial<MyPlaceData>): MyPlaceData {
     *     return new MyPlaceData(
     *       partial.id ?? this.id,
     *       partial.name ?? this.name,
     *       partial.date ?? this.date
     *     );
     *   }
     * }
     * ```
     */
    copy: (partial: Partial<T>) => T;
}
