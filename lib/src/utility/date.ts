


export const getJSTDate = (date: Date): Date =>
    new Date(
        date.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
        }),
    );
