// 日本時間の時刻（jst）を取得する
export const getJSTDate = (date: Date): Date =>
    new Date(
        date.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
        }),
    );
