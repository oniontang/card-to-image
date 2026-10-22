# Admin Web

Card 项目的独立管理后台，基于 Vue 3 + TypeScript + Vite + Ant Design Vue 构建。

## 环境要求

- Node.js (推荐 v20+)
- npm

## 开发指南

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量

可以创建 `.env.local` 覆盖默认配置：

```env
# 接口代理目标，默认为本地开发环境
ADMIN_WEB_API_TARGET=http://localhost:3001
```

### 3. 启动开发服务器

```bash
npm run dev
```

启动后，访问 `http://localhost:5173/admin/`。

### 4. 构建与部署

```bash
# 类型检查与构建打包
npm run build
```

构建产物在 `dist/` 目录下。作为独立的前端项目，可以将 `dist/` 目录通过 Nginx 或其他静态资源服务器进行部署。

## 项目结构

- `src/views/` - 页面组件
- `src/components/` - 公共组件
- `src/api/` - 接口请求
- `src/store/` - 状态管理
- `src/utils/` - 工具函数
- `vite.config.ts` - Vite 配置

