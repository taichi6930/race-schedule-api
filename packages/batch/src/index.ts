import { syncPlaceData } from './syncPlaceData';

interface Env {
    SCRAPING_API_URL: string;
    API_URL: string;
}

interface ScheduledEvent {
    cron: string;
    scheduledTime: number;
}

/**
 * Cloudflare Workers エントリーポイント
 */
export default {
    /**
     * Scheduled handler - cronトリガーで実行される
     */
    async scheduled(
        event: ScheduledEvent,
        env: Env,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ctx: ExecutionContext,
    ): Promise<void> {
        console.log(
            `Cron triggered at ${new Date(event.scheduledTime).toISOString()}`,
        );
        console.log(`Cron pattern: ${event.cron}`);

        try {
            await syncPlaceData(env);
        } catch (error) {
            console.error('Batch execution failed:', error);
            throw error;
        }
    },

    /**
     * Fetch handler - HTTPリクエストで手動実行可能
     */
    async fetch(
        request: Request,
        env: Env,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ctx: ExecutionContext,
    ): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === '/sync-place') {
            try {
                // クエリパラメータから日付範囲とraceTypeを取得
                const startDate = url.searchParams.get('startDate');
                const finishDate = url.searchParams.get('finishDate');
                const raceTypesParam = url.searchParams.get('raceTypes');

                const options =
                    startDate && finishDate
                        ? {
                              startDate,
                              finishDate,
                              raceTypes: raceTypesParam
                                  ? raceTypesParam.split(',')
                                  : undefined,
                          }
                        : undefined;

                await syncPlaceData(env, options);
                return new Response('Place data synchronization completed', {
                    status: 200,
                });
            } catch (error) {
                console.error('Manual sync failed:', error);
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                return new Response(`Error: ${errorMessage}`, { status: 500 });
            }
        }

        if (url.pathname === '/health') {
            return new Response('ok health check packages/batch', {
                status: 200,
            });
        }

        return new Response('Not Found', { status: 404 });
    },
};
