import { resolve } from 'path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    ],
    resolve: {
        alias: {
            "@components": resolve(__dirname, "./src/features/shared/components"),
            "@hooks": resolve(__dirname, "./src/features/shared/hooks"),
            "@lib": resolve(__dirname, "./src/lib"),
            "@utils": resolve(__dirname, "./src/lib/utils"),
            "@assets": resolve(__dirname, "./src/assets"),
            "@shared": resolve(__dirname, "./src/features/shared"),
            "@auth": resolve(__dirname, "./src/features/auth"),
            "@analytics": resolve(__dirname, "./src/features/analytics"),
            "@cattle": resolve(__dirname, "./src/features/cattle"),
            "@finance": resolve(__dirname, "./src/features/finance"),
            "@market": resolve(__dirname, "./src/features/market"),
        }
    }
})
