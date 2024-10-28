// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import EnvironmentPlugin from "file:///app/.yarn/__virtual__/vite-plugin-environment-virtual-c7048eeeab/0/cache/vite-plugin-environment-npm-1.1.3-9540f6719f-8e15190dc3.zip/node_modules/vite-plugin-environment/dist/index.js";
import { defineConfig } from "file:///app/.yarn/__virtual__/vite-virtual-e417a0531a/0/cache/vite-npm-5.4.7-7fb1bc703e-3f27e87093.zip/node_modules/vite/dist/node/index.js";
import vue from "file:///app/.yarn/__virtual__/@vitejs-plugin-vue-virtual-6567382470/0/cache/@vitejs-plugin-vue-npm-5.1.4-63113ceaf9-014f4fc94a.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwind from "file:///app/.yarn/cache/tailwindcss-npm-3.4.12-185cbc286b-34d8306d63.zip/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///app/.yarn/__virtual__/autoprefixer-virtual-b31e738199/0/cache/autoprefixer-npm-10.4.20-dd5fd05d27-d3c4b562fc.zip/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///app/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
        // or "modern"
      }
    },
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [vue(), EnvironmentPlugin("all")],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgRW52aXJvbm1lbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5cbmltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIGNzczoge1xuICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyAvLyBvciBcIm1vZGVyblwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCgpLCBhdXRvcHJlZml4ZXIoKV1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcGx1Z2luczogW3Z1ZSgpLCBFbnZpcm9ubWVudFBsdWdpbignYWxsJyldLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOEwsU0FBUyxlQUFlLFdBQVc7QUFDak8sT0FBTyx1QkFBdUI7QUFDOUIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBRWhCLE9BQU8sY0FBYztBQUNyQixPQUFPLGtCQUFrQjtBQU51RixJQUFNLDJDQUEyQztBQVNqSyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixLQUFLO0FBQUEsSUFDRCxxQkFBcUI7QUFBQSxNQUNqQixNQUFNO0FBQUEsUUFDRixLQUFLO0FBQUE7QUFBQSxNQUNUO0FBQUEsSUFDSjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ0wsU0FBUyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEtBQUssQ0FBQztBQUFBLEVBQ3pDLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
