/**
 * Place データ同期バッチ
 * scrapingからplaceデータを取得し、apiにupsertする
 */

interface Env {
    SCRAPING_API_URL: string;
    API_URL: string;
}

/**
 * 日付をYYYY-MM-DD形式にフォーマット
 */
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 月初と月末を取得
 */
function getMonthRange(date: Date): { start: string; end: string } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
        start: formatDate(start),
        end: formatDate(end),
    };
}

/**
 * 指定したraceTypeとDateRangeでscrapingからplaceデータを取得
 */
async function fetchPlaceData(
    env: Env,
    raceType: string,
    startDate: string,
    finishDate: string,
): Promise<any[]> {
    const url = `${env.SCRAPING_API_URL}/scraping/place?startDate=${startDate}&finishDate=${finishDate}&raceTypeList=${raceType}`;
    console.log(`Fetching place data: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch place data for ${raceType}: ${response.statusText}`,
        );
    }

    const data = await response.json();
    console.log(
        `Fetched ${Array.isArray(data) ? data.length : 0} places for ${raceType}`,
    );
    return Array.isArray(data) ? data : [];
}

/**
 * placeデータをAPIにupsert
 */
async function upsertPlaceData(env: Env, places: any[]): Promise<void> {
    if (places.length === 0) {
        console.log('No places to upsert');
        return;
    }

    const url = `${env.API_URL}/place`;
    console.log(`Upserting ${places.length} places to ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(places),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upsert place data: ${errorText}`);
    }

    const result = await response.json();
    console.log('Upsert result:', result);
}

/**
 * Place データ同期のメイン処理
 */
export async function syncPlaceData(env: Env): Promise<void> {
    console.log('Starting place data synchronization...');

    const now = new Date();
    const allPlaces: any[] = [];

    try {
        // JRA: その年1年分
        const jraYear = now.getFullYear();
        const jraStart = `${jraYear}-01-01`;
        const jraEnd = `${jraYear}-12-31`;
        console.log(`Fetching JRA data for year ${jraYear}`);
        const jraPlaces = await fetchPlaceData(env, 'JRA', jraStart, jraEnd);
        allPlaces.push(...jraPlaces);

        // NAR, KEIRIN, AUTORACE: 先月、今月、来月の3ヶ月
        const raceTypes = ['NAR', 'KEIRIN', 'AUTORACE'];

        for (const raceType of raceTypes) {
            console.log(`Fetching ${raceType} data for 3 months`);

            // 先月
            const lastMonth = new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1,
            );
            const lastMonthRange = getMonthRange(lastMonth);
            const lastMonthPlaces = await fetchPlaceData(
                env,
                raceType,
                lastMonthRange.start,
                lastMonthRange.end,
            );
            allPlaces.push(...lastMonthPlaces);

            // 今月
            const thisMonthRange = getMonthRange(now);
            const thisMonthPlaces = await fetchPlaceData(
                env,
                raceType,
                thisMonthRange.start,
                thisMonthRange.end,
            );
            allPlaces.push(...thisMonthPlaces);

            // 来月
            const nextMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1,
            );
            const nextMonthRange = getMonthRange(nextMonth);
            const nextMonthPlaces = await fetchPlaceData(
                env,
                raceType,
                nextMonthRange.start,
                nextMonthRange.end,
            );
            allPlaces.push(...nextMonthPlaces);
        }

        // 重複排除（placeIdで）
        const uniquePlaces = [
            ...new Map(allPlaces.map((p) => [p.placeId, p])).values(),
        ];
        console.log(
            `Total unique places to upsert: ${uniquePlaces.length} (from ${allPlaces.length} fetched)`,
        );

        // Upsert実行
        await upsertPlaceData(env, uniquePlaces);

        console.log('Place data synchronization completed successfully');
    } catch (error) {
        console.error('Error during place data synchronization:', error);
        throw error;
    }
}
