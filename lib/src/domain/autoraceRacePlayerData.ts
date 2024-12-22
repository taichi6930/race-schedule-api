/**
 * オートレースのレースの選手データ
 */
export class AutoraceRacePlayerData {
    /**
     * コンストラクタ
     *
     * @remarks
     * オートレースのレースの選手データを生成する
     * @param positionNumber - 枠番
     * @param playerNumber - 選手番号
     */
    constructor(
        public readonly positionNumber: number, // 枠番
        public readonly playerNumber: number, // 選手番号
    ) {
        const [isValid, errorMessageList] = this.validate();
        if (!isValid) {
            throw new Error(errorMessageList.join('\n'));
        }
    }

    /**
     * データのコピー
     * @param partial
     * @returns
     */
    copy(
        partial: Partial<AutoraceRacePlayerData> = {},
    ): AutoraceRacePlayerData {
        return new AutoraceRacePlayerData(
            partial.positionNumber ?? this.positionNumber,
            partial.playerNumber ?? this.playerNumber,
        );
    }

    /**
     * バリデーション
     * 型ではない部分でのバリデーションを行う
     *
     * @returns バリデーション結果
     */
    private validate(): [boolean, string[]] {
        // エラー文をまとめて表示する
        const errorMessageList: string[] = [];

        // 枠番が1以上9以下であるか
        if (this.positionNumber < 1 || this.positionNumber > 8) {
            errorMessageList.push('枠番は1以上8以下である必要があります');
        }
        // 選手番号が1以上であるか
        if (this.playerNumber < 1) {
            errorMessageList.push('選手番号は1以上である必要があります');
        }
        return [errorMessageList.length === 0, errorMessageList];
    }
}
