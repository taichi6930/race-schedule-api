import { router } from './router';

export default {
    async fetch(request: Request, env: unknown): Promise<Response> {
        return router(request, env);
    },
};
