/// <reference types="@cloudflare/workers-types" />
import 'reflect-metadata';

import { router } from './router';

addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(router(event.request));
});
