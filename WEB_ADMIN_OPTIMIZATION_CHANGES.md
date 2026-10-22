# Web 端 + Admin 后台优化变更说明

> 日期：2026-07-20
> 范围：card-web（C 端）、card-admin-web（管理后台）
> 验证：两端 `typecheck` 均零错误通过

---

## 一、Web 端（card-web）

### W1 · 安全与稳定性止血

#### 1. AI 轮询内存泄漏修复 — `store/ai.ts`

**问题**：`pollImageResult` 用 `for` 循环 + `setTimeout` 链式等待，无法取消。用户离开页面或发起新一轮生成时，旧轮询仍在后台跑满 40 次 × 1.5s = 60s，造成内存泄漏和无效请求堆积。

**修复方案**：
- 新增模块级 `AbortController` 变量 `imagePollController`
- 新增 `cancelImagePoll()` 导出函数，调用即 abort 当前轮询
- `pollImageResult` 在入口处先 `cancelImagePoll()` 取消旧轮询，再创建新 controller
- 轮询循环中每轮检查 `controller.signal.aborted`
- `request()` 调用传入 `signal` 参数，网络请求层面也可中断
- 等待间隔 `setTimeout` 也绑定 abort 事件，取消时立即 reject 而非空等 1.5s
- `generateAiImageUrl` 捕获 `AbortError` 转为友好提示「图片生成已取消。」

**影响文件**：`src/store/ai.ts`

#### 2. 生成页面卸载清理 — `ImageCardsPage.vue` / `CoverPage.vue`

**问题**：页面卸载时不取消正在进行的轮询。

**修复**：两个页面均在 `onUnmounted` 中调用 `cancelImagePoll()`，确保离开页面时立即终止后台轮询。

**影响文件**：`src/views/ImageCardsPage.vue`、`src/views/CoverPage.vue`

#### 3. 401 未授权处理 — `request.ts`

**问题**：`request()` 收到 401 时只抛 `RequestError`，不清除 token 也不通知上层，导致后续请求持续 401。

**修复**：在 `!response.ok` 判断前增加 401 专项处理：
- 调用 `clearAccessToken()` 清除本地 token
- 派发 `window.dispatchEvent(new CustomEvent("auth:unauthorized"))` 事件
- 上层（路由守卫 / 组件）可监听此事件跳转登录页

**影响文件**：`src/request.ts`

### W2 · 路由与体验

#### 4. 路由懒加载 + 404 + 页面标题 — `router.ts`

**问题**：
- 全部 5 个页面 eager import，首屏加载全部组件 JS
- 无 404 兜底路由，未匹配路径白屏
- 无 `scrollBehavior`，路由切换后滚动位置不重置
- 无页面 `title` meta

**修复**：
- 所有路由改为 `() => import(...)` 动态导入，按需加载
- 新增 `/:pathMatch(.*)*` 404 路由，指向 `NotFoundPage.vue`
- 添加 `scrollBehavior`：有 savedPosition 则恢复，否则回到顶部
- 每条路由添加 `meta.title`，`afterEach` 钩子自动设置 `document.title`
- 新建 `NotFoundPage.vue`：简洁的 404 页面，带「返回首页」链接

**影响文件**：`src/router.ts`（重写）、`src/views/NotFoundPage.vue`（新建）

---

## 二、Admin 后台（card-admin-web）

### A1 · 安全与正确性

#### 1. dayjs 依赖补全 — `package.json`

**问题**：`Dashboard.vue` 中 `import dayjs from 'dayjs'`，但 `package.json` 中未声明该依赖，`npm ci` 全新安装后构建会失败。

**修复**：`npm install dayjs --save`，写入 `dependencies`。

#### 2. AiModels API 路径修正 — `AiModels.vue`

**问题**：UI 已支持 5 个 provider（OpenRouter / OpenAI / DeepSeek / DashScope / 自定义），但 3 处 API 调用路径仍硬编码 `/ai/providers/dashscope/profiles/...`，导致非 DashScope 的配置无法正确读写。

**修复**：将 `fetchProfile`、`saveProfile`、`testProfile` 中的路径统一改为 `/ai/providers/profiles/{env}`，去掉 `dashscope` 段。

#### 3. 移除 dead apiKey 字段 — `AiModels.vue`

**问题**：`apiKey` ref 在 UI 中无任何绑定，但 `saveProfile` 会将其作为 `apiKey: apiKey.value.trim()` 发送给后端，永远传 `undefined`，是死代码且容易误导。

**修复**：删除 `apiKey` ref 声明、`fetchProfile` 中的重置、`saveProfile` payload 中的 `apiKey` 字段。同时删除同样未使用的 `currentMaskedKey` ref。

#### 4. 登录表单移除预填密码 — `Login.vue`

**问题**：`formState` 预填 `username: 'admin'` / `password: '123456'`，生产环境暴露默认凭据，存在安全风险。

**修复**：改为 `username: ''` / `password: ''` / `remember: false`。

#### 5. Token 存储统一管理 — `constants.ts`（新建）

**问题**：`localStorage.getItem('cardServerAdminWebAccessToken')` 字符串散落在 `request.ts`、`router/index.ts`、`Login.vue`、`Layout.vue` 4 个文件中，改 key 名需要逐一搜索修改。

**修复**：新建 `src/constants.ts`，导出 `ADMIN_TOKEN_KEY` 常量和 `getAdminToken()` / `setAdminToken()` / `clearAdminToken()` 三个工具函数。4 个文件全部改为引用这些函数。

**影响文件**：`src/constants.ts`（新建）、`src/api/request.ts`、`src/router/index.ts`、`src/views/Login.vue`、`src/views/Layout.vue`

### A2 · 体验完善

#### 6. 中文 locale — `App.vue`

**问题**：ant-design-vue 默认英文 locale，日期选择器、分页器、空状态等组件文案均为英文。

**修复**：`App.vue` 中 `<a-config-provider :locale="zhCN">`，导入 `ant-design-vue/es/locale/zh_CN`。

#### 7. 404 路由 — `router/index.ts` + `NotFound.vue`（新建）

**问题**：未匹配路径无兜底，白屏。

**修复**：新增 `/:pathMatch(.*)*` 路由，懒加载 `NotFound.vue`（用 `a-result` 组件展示 404）。

#### 8. 清理 HelloWorld 模板残留 — `components/HelloWorld.vue`

**问题**：Vite 脚手架生成的 `HelloWorld.vue` 未被任何页面引用，属于模板残留。

**修复**：直接删除。

#### 9. 测试按钮文案修正 — `AiModels.vue`

**问题**：按钮文案「测试连接 (仅测试 DashScope)」与已支持多 provider 的现状不符。

**修复**：改为「测试连接」。

---

## 三、验证结果

| 项目 | 命令 | 结果 |
|------|------|------|
| card-web | `npm run typecheck` | 零错误 |
| card-admin-web | `npm run typecheck` | 零错误 |

---

## 四、后续待办

| 优先级 | 事项 | 说明 |
|--------|------|------|
| P1 | Dashboard 接入真实统计接口 | 当前所有数据为 mock 硬编码，需后端新增 `/admin/stats` 接口后接入 |
| P1 | Web 端接入用户登录注册 | M2 后端已提供 auth 接口，Web 端需新增登录/注册页 + 路由守卫 + token 管理 |
| P2 | CardPreview.vue XSS 加固 | `marked.parse` 直接输出 v-html，建议引入 DOMPurify 或 marked sanitizer |
| P2 | Web 端 Pinia 状态管理 | 当前用散落的 ref，规模增大后建议迁移 Pinia |
| P2 | jszip 批量下载 | 已安装但未使用，ImageCardsPage 多卡片导出可接入批量 ZIP 下载 |
| P2 | Admin Layout 移动端适配 | 当前侧边栏无 mobile drawer，窄屏下折叠体验不佳 |
