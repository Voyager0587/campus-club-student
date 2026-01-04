# api/ API 接口层

[src/](../CLAUDE.md) > **api/**

> 最后更新：2026-01-04 17:31:33

---

## 模块职责

`api/` 目录封装了所有与后端交互的 HTTP 请求接口，提供统一的调用方式和错误处理机制。

---

## 目录结构

```
api/
├── request.js       # Axios 实例（旧版，已弃用）
├── user.js          # 用户相关接口
├── club.js          # 社团相关接口
└── activity.js      # 活动相关接口
```

---

## 入口与启动

### HTTP 客户端

项目使用 **Axios** 作为 HTTP 客户端，配置位于 `src/utils/request.js`：

```javascript
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/pinia/userStore'

const service = axios.create({
  baseURL: '',           // 通过 Vite proxy 代理
  timeout: 5000
})

// 请求拦截器：自动注入 Token
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  }
)

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      ElMessage.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message))
    }
  },
  (error) => {
    // 处理 401/403/500 等状态码
    switch (error.response?.status) {
      case 401:
        ElMessageBox.confirm('登录状态已过期，请重新登录', '提示')
          .then(() => {
            userStore.logout()
            router.push('/login')
          })
        break
      // ... 其他状态码处理
    }
    return Promise.reject(error)
  }
)
```

---

## 对外接口

### 用户接口 (`user.js`)

```javascript
import request from '@/utils/request'

// 用户注册
export function userRegister(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

// 用户登录
export function userLogin(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}
```

### 社团接口 (`club.js`)

```javascript
import request from '@/utils/request'

const BASE_URL = '/club'

// 分页查询社团列表
export function getClubList(params) {
  return request({
    url: `${BASE_URL}/list`,
    method: 'get',
    params
  })
}

// 查询社团详情
export function getClubDetail(id) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  })
}

// 申请加入社团
export function applyJoinClub(data) {
  return request({
    url: `${BASE_URL}/apply`,
    method: 'post',
    data
  })
}

// 别名导出（保持向后兼容）
export const joinClub = applyJoinClub

// 退出社团
export function quitClub(id) {
  return request({
    url: `${BASE_URL}/quit/${id}`,
    method: 'post'
  })
}

// 查询我加入的社团
export function getMyClub() {
  return request({
    url: `${BASE_URL}/my`,
    method: 'get'
  })
}

// 查询社团成员列表
export function getClubMembers(id) {
  return request({
    url: `${BASE_URL}/${id}/members`,
    method: 'get'
  })
}

// 查询我的社团申请记录
export function getMyClubApplications() {
  return request({
    url: `${BASE_URL}/my/applications`,
    method: 'get'
  })
}
```

### 活动接口 (`activity.js`)

```javascript
import request from '@/utils/request'

// 浏览活动列表（支持关键词和社团筛选）
export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

// 查看活动详情
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

// 报名参加活动
export function signupActivity(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: 'post'
  })
}

// 取消活动报名
export function cancelActivitySignup(id) {
  return request({
    url: `/activity/${id}/signup`,
    method: 'delete'
  })
}

// 查看我的活动报名记录
export function getMyActivitySignups() {
  return request({
    url: '/activity/my-signups',
    method: 'get'
  })
}
```

---

## 关键依赖与配置

### 依赖

- **axios** (^1.13.2)：HTTP 客户端
- **element-plus** (^2.13.0)：用于消息提示（ElMessage、ElMessageBox）

### 请求配置

- **baseURL**：空字符串（通过 Vite proxy 代理）
- **timeout**：5000ms
- **headers**：自动注入 `Authorization: Bearer ${token}`

### 错误处理

| 状态码 | 处理方式 |
|--------|----------|
| 200 | 正常返回 |
| 400 | 提示"参数填写错误，请检查后重试" |
| 401 | 弹窗确认后跳转登录页 |
| 403 | 提示"没有操作权限" |
| 500 | 提示"服务器内部错误，请稍后再试" |

---

## 数据模型

### 通用响应格式

```typescript
{
  code: number,      // 200 表示成功
  message: string,   // 响应消息
  data: any          // 响应数据
}
```

### 分页响应格式

```typescript
{
  code: 200,
  message: "success",
  data: {
    records: T[],    // 数据列表
    total: number,   // 总记录数
    pageNum: number, // 当前页码
    pageSize: number // 每页大小
  }
}
```

---

## 测试与质量

⚠️ **当前无测试覆盖**

建议补充 API 接口的单元测试：

```javascript
// 示例：使用 Vitest 测试 API
import { describe, it, expect, vi } from 'vitest'
import { getClubList } from '@/api/club'

describe('Club API', () => {
  it('should fetch club list', async () => {
    const mockData = { records: [], total: 0 }
    // Mock axios request...
    const res = await getClubList({ pageNum: 1, pageSize: 10 })
    expect(res.data).toEqual(mockData)
  })
})
```

---

## 常见问题 (FAQ)

### Q1: 为什么有两个 `request.js`？

A: `src/api/request.js` 是旧版本（硬编码 baseURL），`src/utils/request.js` 是新版本（通过 Vite proxy）。新代码应使用 `@/utils/request`。

### Q2: 如何添加新的 API 接口？

1. 在对应的模块文件（`user.js`/`club.js`/`activity.js`）中添加函数
2. 使用 `export function` 导出命名函数
3. 函数签名遵循 RESTful 风格

### Q3: 如何处理文件上传？

```javascript
export function uploadFile(formData) {
  return request({
    url: '/api/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

---

## 相关文件清单

- `src/utils/request.js` - Axios 实例与拦截器
- `src/pinia/userStore.js` - 用户状态（Token 来源）
- `vite.config.js` - Vite proxy 配置

---

## 变更记录 (Changelog)

### 2026-01-04
- 初始化 API 模块文档
- 梳理所有对外接口
- 标注废弃的 `src/api/request.js`
