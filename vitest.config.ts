import os from 'os';
import path from 'path';
import { defineConfig } from 'vitest/config';

// Determine suitable thread counts from available CPUs.
// Reserve fewer cores (1) to increase parallelism by default while keeping the
// system responsive. Users can still override with environment variables.
const totalCpus = Math.max(1, (os.cpus() || []).length);
const reservedCpus = totalCpus > 1 ? 1 : 0; // leave 1 core free when available
const autoMax = Math.max(1, totalCpus - reservedCpus);
const autoMin = Math.max(1, Math.floor(autoMax / 2));

// Use fixed thread counts by default: allocate (totalCpus - reservedCpus)
// worker threads and set a sensible minimum (half of max). This keeps
// behavior deterministic across environments; adjust reservedCpus above
// if you want to reserve more cores.
const fixedMaxThreads = Math.max(1, totalCpus - reservedCpus);
const fixedMinThreads = Math.max(1, Math.floor(fixedMaxThreads / 2));

if (!process.env.VITEST_NO_AUTO_LOG) {
    console.log(
        `[vitest] cpu total:${totalCpus}, reserved:${reservedCpus}, fixed -> max:${fixedMaxThreads}, min:${fixedMinThreads}`,
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
                // Use fixed values derived from available CPUs.
                maxThreads: fixedMaxThreads,
                minThreads: fixedMinThreads,
            },
        },
    },
});
