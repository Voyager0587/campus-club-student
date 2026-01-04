# pinia/ 状态管理目录

[src/](../CLAUDE.md) > **pinia/**

> 最后更新：2026-01-04 17:31:33

---

## 模块职责

`pinia/` 目录包含 Pinia store 定义，负责管理全局状态（如用户认证信息）。

---

## 目录结构

```
pinia/
└── userStore.js       # 用户状态管理
```

---

## 入口与启动

### Store 注册

在 `src/main.js` 中注册 Pinia：

```javascript
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
```

---

## 对外接口

### `userStore.js` - 用户状态管理

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  // ========== 状态 ==========
  const token = ref(Cookies.get('token') || '')
  const userInfo = ref({})

  // ========== 动作 ==========

  // 登录：保存 Token 和用户信息
  const login = (tokenVal, userInfoVal) => {
    token.value = tokenVal
    userInfo.value = userInfoVal
    // Token 持久化（有效期 7 天）
    Cookies.set('token', tokenVal, { expires: 7 })
  }

  // 退出登录：清除状态和 Cookie
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    Cookies.remove('token')
  }

  return { token, userInfo, login, logout }
})
```

---

## 关键依赖与配置

### 依赖

- **pinia** (^3.0.4)：Vue 3 状态管理库
- **js-cookie** (^3.0.5)：Cookie 管理

### 状态结构

```javascript
{
  token: string,        // 认证 Token（存储在 Cookie）
  userInfo: {           // 用户信息对象
    username: string,
    id: number,
    // ...其他字段
  }
}
```

---

## 使用方式

### 在组件中使用

```javascript
import { useUserStore } from '@/pinia/userStore'

const userStore = useUserStore()

// 读取状态
console.log(userStore.token)
console.log(userStore.userInfo)

// 调用动作
userStore.login('new-token', { username: 'Alice' })
userStore.logout()
```

### 在路由守卫中使用

```javascript
import { useUserStore } from '@/pinia/userStore'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})
```

### 在 Axios 拦截器中使用

```javascript
import { useUserStore } from '@/pinia/userStore'

service.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers['Authorization'] = `Bearer ${userStore.token}`
  }
  return config
})
```

---

## 数据模型

### Token

- **类型**：`string`
- **存储位置**：Cookie（通过 js-cookie）
- **有效期**：7 天
- **用途**：API 请求认证（Bearer Token）

### 用户信息

```typescript
interface UserInfo {
  username: string
  id: number
  email?: string
  phone?: string
  avatar?: string
  // ...其他后端返回的字段
}
```

---

## 测试与质量

⚠️ **当前无测试覆盖**

建议补充 Store 单元测试：

```javascript
// 使用 Vitest 测试 Pinia Store
import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/pinia/userStore'

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useUserStore()
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({})
  })

  it('logs in and saves token', () => {
    const store = useUserStore()
    store.login('test-token', { username: 'Alice' })
    expect(store.token).toBe('test-token')
    expect(store.userInfo.username).toBe('Alice')
  })

  it('logs out and clears state', () => {
    const store = useUserStore()
    store.login('test-token', {})
    store.logout()
    expect(store.token).toBe('')
    expect(store.userInfo).toEqual({})
  })
})
```

---

## 常见问题 (FAQ)

### Q1: 为什么选择 Pinia 而不是 Vuex？

A: Pinia 是 Vue 3 官方推荐的状态管理库，相比 Vuex：
- 更轻量（体积更小）
- 更好的 TypeScript 支持
- 去除了 mutations，只保留 state、getters、actions
- 支持 Composition API 风格

### Q2: Token 存储在 Cookie 还是 localStorage？

A: 当前项目使用 Cookie（通过 js-cookie），优点：
- 可以设置过期时间
- 默认会随 HTTP 请求发送（可用于服务端渲染）
- 避免 XSS 攻击（localStorage 易受攻击）

### Q3: 如何添加新的 Store？

```javascript
// src/pinia/新Store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewStore = defineStore('newStore', () => {
  const state = ref('initial value')

  const updateState = (newValue) => {
    state.value = newValue
  }

  return { state, updateState }
})
```

---

## 相关文件清单

- `src/main.js` - Pinia 实例注册
- `src/router/index.js` - 路由守卫中使用
- `src/utils/request.js` - Axios 请求拦截器中使用
- `src/pages/Login.vue` - 登录时调用 `userStore.login()`
- `src/layouts/Layout.vue` - 退出时调用 `userStore.logout()`

---

## 变更记录 (Changelog)

### 2026-01-04
- 初始化 Pinia 模块文档
- 梳理 userStore 的状态和方法
- 补充使用示例和测试建议
