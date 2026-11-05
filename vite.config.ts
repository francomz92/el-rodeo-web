import { resolve } from 'path'
import { configDefaults, defineConfig } from 'vitest/config'
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
            "@reports": resolve(__dirname, "./src/features/reports"),
        }
    },
    test: {
        // Tooling worktrees under .delta/ duplicate the whole repo (and its
        // tests); never discover them from the main checkout.
        exclude: [...configDefaults.exclude, ".delta/**"],
    },
})
