// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import EnvironmentPlugin from "file:///app/.yarn/__virtual__/vite-plugin-environment-virtual-c7048eeeab/0/cache/vite-plugin-environment-npm-1.1.3-9540f6719f-8e15190dc3.zip/node_modules/vite-plugin-environment/dist/index.js";
import { defineConfig } from "file:///app/.yarn/__virtual__/vite-virtual-bbfd4fade1/0/cache/vite-npm-5.3.1-0fe9027262-180ca17953.zip/node_modules/vite/dist/node/index.js";
import vue from "file:///app/.yarn/__virtual__/@vitejs-plugin-vue-virtual-c096f0f9f8/0/cache/@vitejs-plugin-vue-npm-5.0.5-e37db359ea-b87d2cf62f.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import tailwind from "file:///app/.yarn/cache/tailwindcss-npm-3.4.4-18aba64742-ab120014a6.zip/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///app/.yarn/__virtual__/autoprefixer-virtual-daa9c5b31c/0/cache/autoprefixer-npm-10.4.19-7c86a73b2f-98378eae37.zip/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///app/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [
    vue(),
    EnvironmentPlugin("all")
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCBFbnZpcm9ubWVudFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5cbmltcG9ydCB0YWlsd2luZCBmcm9tIFwidGFpbHdpbmRjc3NcIlxuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tIFwiYXV0b3ByZWZpeGVyXCJcblxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3RhaWx3aW5kKCksIGF1dG9wcmVmaXhlcigpXSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgRW52aXJvbm1lbnRQbHVnaW4oJ2FsbCcpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxTQUFTLGVBQWUsV0FBVztBQUNqTyxPQUFPLHVCQUF1QjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFFaEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sa0JBQWtCO0FBTnVGLElBQU0sMkNBQTJDO0FBVWpLLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixrQkFBa0IsS0FBSztBQUFBLEVBQ3pCO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
