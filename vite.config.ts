import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // 库模式配置
    lib: {
      // 入口文件路径
      entry: "src/index.ts",
      // 暴露的全局变量名称
      name: "snowdenRequest",
      // 输出文件名称（不包含扩展名）
      fileName: "snowden-request",
      // 生成的包格式
      // es: ES Module格式
      // umd: Universal Module Definition格式，同时支持CommonJS、AMD和全局变量引入
      formats: ["es", "umd"],
    },
    // Rollup构建配置
    rollupOptions: {
      // 外部依赖配置，这些依赖不会被打包
      external: ["axios"],
      output: {
        // 在UMD构建模式下为外部依赖提供全局变量名称
        globals: {
          axios: "axios",
        },
      },
    },
  },
});
