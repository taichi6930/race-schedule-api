import os from 'os';
import path from 'path';
import { defineConfig } from 'vitest/config';

// Determine suitable thread counts from available CPUs.
// Reserve 2 cores when possible to keep the system responsive during test runs.
const totalCpus = Math.max(1, (os.cpus() || []).length);
const reservedCpus = totalCpus > 2 ? 2 : 0; // leave 2 cores free when available
const autoMax = Math.max(1, totalCpus - reservedCpus);
const autoMin = Math.max(1, Math.floor(autoMax / 2));

// Allow environment overrides: VITEST_MAX_THREADS and VITEST_MIN_THREADS
const envMax = process.env.VITEST_MAX_THREADS
    ? Number(process.env.VITEST_MAX_THREADS)
    : undefined;
const envMin = process.env.VITEST_MIN_THREADS
    ? Number(process.env.VITEST_MIN_THREADS)
    : undefined;

const parsedEnvMax = typeof envMax === 'number' ? envMax : undefined;
const parsedEnvMin = typeof envMin === 'number' ? envMin : undefined;
const maxThreadsAuto =
    parsedEnvMax && parsedEnvMax > 0 ? parsedEnvMax : autoMax;
const minThreadsAuto =
    parsedEnvMin && parsedEnvMin > 0 ? parsedEnvMin : autoMin;

if (!process.env.VITEST_NO_AUTO_LOG) {
    console.log(
        `[vitest] cpu total:${totalCpus}, reserved:${reservedCpus}, auto -> max:${maxThreadsAuto}, min:${minThreadsAuto}`,
    );
}

export default defineConfig({
    // No Vite plugins required for backend tests
    resolve: {
        alias: {
            // Alias used in tests/source imports. Adjust if your sources live elsewhere.
            '@': path.resolve(__dirname, 'lib/src'),
        },
    },
    test: {
        environment: 'node',
        globals: true,
        // Enable official Vitest UI (browser-based) and configure coverage reporters
        ui: true,
        open: true,
        // Report slow tests (milliseconds) in output and UI
        slowTestThreshold: 2000,
        reporters: ['default'],
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
        // Also provide alias mapping under test for compatibility with some loaders
        // (Vitest will respect Vite's resolve.alias, but adding here helps test utils).
        alias: {
            '@': path.resolve(__dirname, 'lib/src'),
        },

        poolOptions: {
            threads: {
                // Use auto-calculated values but keep sensible minimums.
                maxThreads: maxThreadsAuto,
                minThreads: minThreadsAuto,
            },
        },
    },
});
