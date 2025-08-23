import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        setupFiles: './test/setup-vitest-globals.ts',
        coverage: {
            provider: 'v8',
            // Exclude large or irrelevant folders from coverage collection to avoid
            // scanning many files (which can cause high memory use) and sourcemap errors.
            exclude: [
                'node_modules/**',
                'cdk.out/**',
                'coverage/**',
                'docs/**',
                'jest-html-reporters-attach/**',
                'dist/**',
                'bin/**',
                '.git/**',
            ],
        },
    },
});
