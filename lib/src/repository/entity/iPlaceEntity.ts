/**
 * 開催場所エンティティの基本インターフェース
 *
 * このインターフェースは、レース開催場所のエンティティが持つべき
 * 共通の振る舞いを定義します。主な特徴：
 * - イミュータブル（不変）なデータ構造
 * - 型安全な部分更新機能
 * - 自己参照型による型安全性の確保
 *
 * このインターフェースを実装するエンティティは、以下のような
 * 開催場所に関する情報を保持します：
 * - 場所ID
 * - 開催日
 * - 場所名
 * など
 * @typeParam T - 実装クラス自身の型。自己参照型として使用され、
 *               型安全な継承を可能にします。
 *               例：class PlaceEntity implements IPlaceEntity<PlaceEntity>
 */
export interface IPlaceEntity<T extends IPlaceEntity<T>> {
    /**
     * エンティティの部分的な更新を行い、新しいインスタンスを返します
     *
     * このメソッドは、イミュータブルな方法でエンティティの
     * フィールドを更新するために使用されます。
     * @param partial - 更新したいフィールドを含むオブジェクト。
     * Partial型により、一部のフィールドのみの指定が可能です。
     * @returns 更新された新しいエンティティインスタンス
     * @example
     * ```typescript
     * const newEntity = entity.copy({ date: newDate });
     * ```
     */
    copy: (partial: Partial<T>) => T;
}
