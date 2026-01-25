import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.test.ts'],
        setupFiles: ['../../test/setup-vitest-globals.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.d.ts', 'src/**/index.ts'],
        },
    },
    resolve: {
        alias: {
            '@race-schedule/shared': resolve(__dirname, '../shared'),
            '@race-schedule/shared/src': resolve(__dirname, '../shared/src'),
        },
    },
});
