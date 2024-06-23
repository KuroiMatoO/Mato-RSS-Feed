import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // This will ensure that the asset paths are relative to the current directory
  build: {
    assetsDir: '', // This will place the generated assets in the same directory as the build output
  },
})