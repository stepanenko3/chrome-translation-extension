import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Получаем __filename и __dirname в стиле ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: './postcss.config.cjs',
    },
    build: {
        rollupOptions: {
            input: {
                background: resolve(__dirname, 'src/background.ts'),
                content: resolve(__dirname, 'src/content.ts'),
                index: resolve(__dirname, 'src/index.css'), // добавьте этот файл
            },
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
                format: 'es',
            },
        },
    },
});
