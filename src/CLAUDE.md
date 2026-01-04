# src/ 源代码目录

[根目录](../CLAUDE.md) > **src/**

> 最后更新：2026-01-04 17:31:33

---

## 模块职责

`src/` 是项目的核心源代码目录，包含所有前端代码、组件、页面、路由和状态管理逻辑。

---

## 目录结构

```
src/
├── api/              # API 接口层
├── assets/           # 静态资源（图片、字体等）
├── components/       # 通用组件
├── layouts/          # 布局组件
├── mock/             # 模拟数据
├── pages/            # 页面组件
│   ├── activity/     # 活动相关页面
│   ├── club/         # 社团相关页面
│   └── user/         # 用户相关页面
├── pinia/            # Pinia 状态管理
├── router/           # 路由配置
├── stores/           # 状态存储（备用）
├── utils/            # 工具函数
├── App.vue           # 根组件
├── main.js           # 入口文件
└── style.css         # 全局样式
```

---

## 入口与启动

### 应用启动流程

1. **`index.html`** → 加载应用容器
2. **`main.js`** → 创建 Vue 应用实例，注册插件（Element Plus、Pinia、Router）
3. **`App.vue`** → 渲染根组件
4. **`router/index.js`** → 根据路由加载对应页面组件

### `main.js` 关键代码

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia()

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
```

---

## 对外接口

### 页面路由

| 路径 | 组件 | 说明 | 需要认证 |
|------|------|------|----------|
| `/login` | `Login.vue` | 用户登录 | ❌ |
| `/register` | `Register.vue` | 用户注册 | ❌ |
| `/home` | `Layout.vue` + `HomeIndex.vue` | 首页 | ✅ |
| `/home/club/list` | `ClubList.vue` | 社团列表 | ✅ |
| `/home/club/detail/:id` | `ClubDetail.vue` | 社团详情 | ✅ |
| `/home/club/my` | `MyClub.vue` | 我的社团 | ✅ |
| `/home/club/my/applications` | `MyClubApplication.vue` | 我的社团申请 | ✅ |
| `/home/activity/list` | `ActivityList.vue` | 活动列表 | ✅ |
| `/home/activity/detail/:id` | `ActivityDetail.vue` | 活动详情 | ✅ |
| `/home/activity/my-signups` | `MyActivitySignup.vue` | 我的活动报名 | ✅ |
| `/home/user/info` | `UserInfo.vue` | 个人信息 | ✅ |

### API 接口层

所有 API 接口位于 `src/api/` 目录：

- **`user.js`**：用户注册、登录、获取/更新用户信息
- **`club.js`**：社团列表、详情、申请加入、退出、我的社团
- **`activity.js`**：活动列表、详情、报名、取消报名

详见：[api/CLAUDE.md](./api/CLAUDE.md)

---

## 关键依赖与配置

### 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | ^3.3.8 | 渐进式前端框架 |
| vue-router | ^4.6.4 | 路由管理 |
| pinia | ^3.0.4 | 状态管理 |
| element-plus | ^2.13.0 | UI 组件库 |
| axios | ^1.13.2 | HTTP 客户端 |
| js-cookie | ^3.0.5 | Cookie 管理 |

### Vite 配置

- **路径别名**：`@` → `./src`
- **开发服务器端口**：3000
- **代理配置**：
  - `/api/*` → `http://8.148.195.239:8080/api`
  - `/club/*` → `http://8.148.195.239:8080/api`
  - `/activity/*` → `http://8.148.195.239:8080/api`

---

## 数据模型

### 用户模型（UserStore）

```javascript
{
  token: string,        // 认证 Token（存储在 Cookie）
  userInfo: {
    username: string,
    id: number,
    // ...其他用户字段
  }
}
```

### 社团模型

```javascript
{
  id: number,
  name: string,
  description: string,
  createUsername: string,  // 负责人
  status: 'normal' | 'disabled',
  memberCount: number
}
```

### 活动模型

```javascript
{
  id: number,
  title: string,
  description: string,
  clubName: string,
  startTime: string,      // ISO 8601 格式
  location: string,
  status: 'published' | 'ongoing' | 'completed' | 'cancelled',
  signupCount: number
}
```

---

## 测试与质量

⚠️ **当前无测试覆盖**

项目未配置任何测试框架或代码质量工具。

建议补充：

1. **单元测试**：使用 Vitest 测试工具函数和 Pinia store
2. **组件测试**：使用 @vue/test-utils 测试页面组件
3. **代码检查**：添加 ESLint + Prettier

---

## 常见问题 (FAQ)

### Q1: 如何添加新页面？

1. 在 `src/pages/` 或子目录下创建 Vue 组件
2. 在 `src/router/index.js` 中添加路由配置
3. 如需认证，设置 `meta.requiresAuth: true`

### Q2: 如何调用后端接口？

```javascript
// 从 src/api/ 导入封装好的函数
import { getClubList } from '@/api/club'

// 在组件中调用
const fetchData = async () => {
  try {
    const res = await getClubList({ pageNum: 1, pageSize: 10 })
    console.log(res.data)
  } catch (error) {
    console.error(error)
  }
}
```

### Q3: 如何获取当前用户信息？

```javascript
import { useUserStore } from '@/pinia/userStore'

const userStore = useUserStore()
console.log(userStore.token)      // Token
console.log(userStore.userInfo)   // 用户信息
```

---

## 相关文件清单

### 核心文件

- `src/main.js` - 应用入口
- `src/App.vue` - 根组件
- `src/router/index.js` - 路由配置
- `src/pinia/userStore.js` - 用户状态管理
- `src/utils/request.js` - HTTP 请求封装

### 页面组件

- `src/pages/Login.vue` - 登录页
- `src/pages/Register.vue` - 注册页
- `src/pages/HomeIndex.vue` - 首页
- `src/pages/club/` - 社团相关页面
- `src/pages/activity/` - 活动相关页面
- `src/pages/user/UserInfo.vue` - 个人信息页

### API 接口

- `src/api/user.js` - 用户 API
- `src/api/club.js` - 社团 API
- `src/api/activity.js` - 活动 API

---

## 变更记录 (Changelog)

### 2026-01-04
- 初始化模块文档
- 完成目录结构与数据模型梳理
