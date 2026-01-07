# pages/ 页面组件目录

[src/](../CLAUDE.md) > **pages/**

> 最后更新：2026-01-04 17:31:33

---

## 模块职责

`pages/` 目录包含所有页面级 Vue 组件，按功能模块划分为用户、社团、活动三大类。

---

## 目录结构

```
pages/
├── Login.vue                  # 用户登录页
├── Register.vue               # 用户注册页
├── HomeIndex.vue              # 首页（仪表盘）
├── activity/                  # 活动模块
│   ├── ActivityList.vue       # 活动列表
│   ├── ActivityDetail.vue     # 活动详情
│   └── MyActivitySignup.vue   # 我的活动报名
├── club/                      # 社团模块
│   ├── ClubList.vue           # 社团列表
│   ├── ClubDetail.vue         # 社团详情
│   ├── MyClub.vue             # 我的社团
│   └── MyClubApplication.vue  # 我的社团申请
└── user/
    └── UserInfo.vue           # 个人信息
```

---

## 入口与启动

### 页面加载流程

1. 用户访问 URL → `vue-router` 匹配路由
2. 路由守卫检查 `meta.requiresAuth`
3. 如需认证，检查 Pinia store 中的 Token
4. 加载对应页面组件

### 路由配置

所有页面路由在 `src/router/index.js` 中定义：

```javascript
{
  path: '/home',
  component: Layout,
  meta: { requiresAuth: true },
  children: [
    { path: 'club/list', component: () => import('@/pages/club/ClubList.vue') },
    { path: 'activity/list', component: () => import('@/pages/activity/ActivityList.vue') },
    // ...
  ]
}
```

---

## 对外接口

### 公共页面组件

| 组件 | 路由 | 说明 | 认证 |
|------|------|------|------|
| `Login.vue` | `/login` | 用户登录 | ❌ |
| `Register.vue` | `/register` | 用户注册 | ❌ |
| `HomeIndex.vue` | `/home` | 首页仪表盘 | ✅ |

### 活动模块组件

| 组件 | 路由 | 功能 |
|------|------|------|
| `ActivityList.vue` | `/home/activity/list` | 浏览所有活动，支持关键词和社团筛选 |
| `ActivityDetail.vue` | `/home/activity/detail/:id` | 查看活动详情，报名/取消报名 |
| `MyActivitySignup.vue` | `/home/activity/my-signups` | 查看我的活动报名记录 |

### 社团模块组件

| 组件 | 路由 | 功能 |
|------|------|------|
| `ClubList.vue` | `/home/club/list` | 浏览所有社团，支持关键词搜索 |
| `ClubDetail.vue` | `/home/club/detail/:id` | 查看社团详情，申请加入/退出 |
| `MyClub.vue` | `/home/club/my` | 查看已加入的社团 |
| `MyClubApplication.vue` | `/home/club/my/applications` | 查看社团申请记录 |

### 用户模块组件

| 组件 | 路由 | 功能 |
|------|------|------|
| `UserInfo.vue` | `/home/user/info` | 查看和编辑个人信息 |

---

## 关键依赖与配置

### 组件依赖

所有页面组件依赖：

- **Vue 3** (Composition API)
- **Element Plus** (UI 组件库)
- **Vue Router** (路由导航)
- **Pinia Store** (用户状态)

### 典型组件结构

```vue
<template>
  <div class="page-container">
    <!-- 页面内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiFunction } from '@/api/...'

const router = useRouter()
const data = ref([])

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  try {
    const res = await apiFunction()
    data.value = res.data
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
/* 样式 */
</style>
```

---

## 数据模型

### 活动列表数据

```javascript
{
  id: number,
  title: string,
  description: string,
  clubName: string,
  startTime: string,      // ISO 8601 格式
  location: string,
  status: 'published' | 'ongoing' | 'completed' | 'cancelled'
}
```

### 社团列表数据

```javascript
{
  id: number,
  name: string,
  description: string,
  createUsername: string,
  status: 'normal' | 'disabled',
  memberCount: number
}
```

---

## 测试与质量

⚠️ **当前无测试覆盖**

建议补充组件测试：

```javascript
// 使用 @vue/test-utils 测试组件
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ClubList from '@/pages/club/ClubList.vue'

describe('ClubList', () => {
  it('renders club list', () => {
    const wrapper = mount(ClubList)
    expect(wrapper.find('.club-list-container').exists()).toBe(true)
  })
})
```

---

## 常见问题 (FAQ)

### Q1: 如何添加新页面？

1. 在 `pages/` 或子目录创建 Vue 组件
2. 在 `src/router/index.js` 添加路由配置
3. 在侧边栏（`Layout.vue`）添加菜单项（如需）

### Q2: 如何实现页面跳转？

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 路径跳转
router.push('/home/club/list')

// 命名路由跳转
router.push({ name: 'ClubDetail', params: { id: 1 } })

// 带查询参数
router.push({ path: '/home/activity/list', query: { keyword: '音乐' } })
```

### Q3: 如何在页面中调用 API？

```javascript
import { getClubList } from '@/api/club'

const fetchData = async () => {
  try {
    const res = await getClubList({ pageNum: 1, pageSize: 10 })
    console.log(res.data)
  } catch (error) {
    console.error(error)
  }
}
```

---

## 相关文件清单

### 核心文件

- `src/router/index.js` - 路由配置
- `src/layouts/Layout.vue` - 主布局（侧边栏 + 顶部栏）

### 活动模块

- `src/pages/activity/ActivityList.vue`
- `src/pages/activity/ActivityDetail.vue`
- `src/pages/activity/MyActivitySignup.vue`
- `src/api/activity.js` - 活动 API

### 社团模块

- `src/pages/club/ClubList.vue`
- `src/pages/club/ClubDetail.vue`
- `src/pages/club/MyClub.vue`
- `src/pages/club/MyClubApplication.vue`
- `src/api/club.js` - 社团 API

### 用户模块

- `src/pages/Login.vue`
- `src/pages/Register.vue`
- `src/pages/user/UserInfo.vue`
- `src/api/user.js` - 用户 API

---

## 变更记录 (Changelog)

### 2026-01-04
- 初始化页面模块文档
- 梳理所有页面组件及其功能
- 补充典型组件结构示例
