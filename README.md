# 工具箱

前端开发常用的可视化小工具集合 —— CSS 渐变、阴影、圆角、噪音纹理、剪贴路径,以及计算器、JSON 生成、正则可视化、选择器速查。

纯前端应用,无后端、无数据库,基于 Nuxt 4(SPA / 静态生成),经 GitHub Actions 部署到 GitHub Pages。

## 技术栈

- [Nuxt 4](https://nuxt.com/) —— `ssr: false`,SPA / 静态生成
- [UnoCSS](https://unocss.dev/) —— 原子化 CSS
- [PrimeVue](https://primevue.org/) —— UI 组件库(Aura 主题)
- [@wzo/utils](https://www.npmjs.com/package/@wzo/utils) / [@wzo/calc](https://www.npmjs.com/package/@wzo/calc) —— 通用工具函数与精确运算

## 开发

```bash
pnpm i          # 安装依赖
pnpm dev        # 启动开发服务
pnpm build      # 构建
pnpm generate   # 生成静态站点(部署产物)
pnpm lint       # 代码检查
pnpm typecheck  # 类型检查
```
