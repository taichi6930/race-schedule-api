/**
 * データの永続化層で使用される基本レコード型のインターフェース
 *
 * このインターフェースは、永続化されるデータの基本的な操作と
 * イミュータブルな性質を定義します。主な特徴：
 * - イミュータブル（不変）なデータ構造
 * - 型安全な部分更新機能
 * - 自己参照型による型の整合性保証
 *
 * このインターフェースを実装するクラスは、以下のような
 * データの永続化に関する操作を提供します：
 * - データの読み取り
 * - 新しいインスタンスとしての更新
 * - シリアライズ可能なデータ構造
 * @typeParam T - 実装クラス自身の型。自己参照型として使用され、
 *               型安全な継承を可能にします。
 *               例：class JraRaceRecord implements IRecord<JraRaceRecord>
 */
export interface IRecord<T extends IRecord<T>> {
    /**
     * レコードの部分的な更新を行い、新しいインスタンスを返します
     *
     * このメソッドは、イミュータブルな方法でレコードの
     * フィールドを更新するために使用されます。元のインスタンスは
     * 変更されず、更新されたフィールドを持つ新しいインスタンスが
     * 返されます。
     * @param partial - 更新したいフィールドを含むオブジェクト。
     *                Partial型により、一部のフィールドのみの指定が可能です。
     * @returns 更新された新しいレコードインスタンス
     * @example
     * ```typescript
     * class MyRecord implements IRecord<MyRecord> {
     *   constructor(public readonly id: string, public readonly name: string) {}
     *
     *   copy(partial: Partial<MyRecord>): MyRecord {
     *     return new MyRecord(
     *       partial.id ?? this.id,
     *       partial.name ?? this.name
     *     );
     *   }
     * }
     *
     * const record = new MyRecord("1", "old");
     * const updated = record.copy({ name: "new" });
     * // record: { id: "1", name: "old" }
     * // updated: { id: "1", name: "new" }
     * ```
     */
    copy: (partial: Partial<T>) => T;
}
