import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: './test/setup-vitest-globals.ts',
        // Enable official Vitest UI (browser-based) and configure coverage reporters
        ui: true,
        open: true,
        coverage: {
            provider: 'v8',
            // Generate coverage reports even when some tests fail
            // (Vitest may skip generating reports on failure depending on version/config).
            reportOnFailure: true,
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            // Exclude large or irrelevant folders from coverage collection to avoid
            // scanning many files (which can cause high memory use) and sourcemap errors.
            include: ['lib/src/**/*.ts'],
            exclude: [
                'lib/src/utility/sqlite/**',
                'lib/src/utility/sqlite/migrations/**',
                'lib/stack',
            ],
        },
        poolOptions: {
            threads: {
                maxThreads: 5,
                minThreads: 4,
            },
        },
    },
});
