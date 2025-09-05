import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    define: {
        global: 'globalThis',
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'InactivityWarning',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: [
                'vue',
                'react',
                'react-dom',
                '@angular/core',
                '@angular/common',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic'
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@angular/core': 'ng.core',
                    '@angular/common': 'ng.common',
                    '@angular/platform-browser': 'ng.platformBrowser',
                    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic'
                }
            }
        },
        minify: 'terser',
        sourcemap: true
    }
})
