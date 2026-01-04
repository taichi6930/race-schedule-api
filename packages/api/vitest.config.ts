import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.test.ts'],
        root: path.resolve(__dirname, '.'),
        setupFiles: ['../../test/setup-vitest-globals.ts'],
    },
    resolve: {
        alias: {
            '@race-schedule/shared': path.resolve(__dirname, '../../shared'),
            '@race-schedule/shared/src': path.resolve(
                __dirname,
                '../../shared/src',
            ),
        },
    },
});
