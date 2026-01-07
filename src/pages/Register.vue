<template>
  <div class="register-page">
    <!-- 左侧装饰区 -->
    <div class="register-banner">
      <div class="banner-content">
        <h1>校园社团管理系统</h1>
        <p>注册账号，开启你的社团之旅</p>
      </div>
    </div>
    <!-- 右侧注册表单区 -->
    <div class="register-form-wrapper">
      <div class="register-card">
        <div class="register-title">
          <h2>用户注册</h2>
          <p>填写以下信息，创建你的账号</p>
        </div>
        <el-form 
          :model="registerForm" 
          label-width="0px" 
          class="register-form"
          :rules="registerRules"
          ref="registerFormRef"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="registerForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="请输入密码（不少于6位）"
              prefix-icon="Lock"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input 
              v-model="registerForm.realName" 
              placeholder="请输入真实姓名"
              prefix-icon="UserFilled"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="studentId">
            <el-input
              v-model="registerForm.studentId"
              placeholder="请输入学号"
              prefix-icon="Ticket"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              prefix-icon="Message"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              prefix-icon="Phone"
              size="large"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-actions">
            <el-button 
              type="primary" 
              size="large"
              class="register-btn"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
          <div class="login-link">
            已有账号？<span @click="toLogin">立即登录</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userRegister } from '../api/user'
import { useStorage } from '@vueuse/core'

const router = useRouter()
const registerFormRef = ref(null)

// ========== 使用 VueUse 实现本地存储同步 ==========
// 注册表单数据（自动同步到 localStorage）
const registerForm = useStorage('register_form_data', {
  username: '',
  password: '',  // 注意：密码不会持久化到 localStorage（安全考虑）
  realName: '',
  studentId: '',
  email: '',
  phone: ''
}, localStorage, {
  // 序列化前移除密码字段（不在本地存储密码）
  serializer: {
    read: (v) => {
      try {
        const data = JSON.parse(v)
        data.password = ''  // 读取时清空密码
        return data
      } catch {
        return { username: '', password: '', realName: '', studentId: '', email: '', phone: '' }
      }
    },
    write: (v) => {
      const { password, ...safeData } = v  // 排除密码
      return JSON.stringify(safeData)
    }
  }
})

// ========== 表单校验规则 ==========
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8,12}$/, message: '学号应为 8-12 位数字', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}

// ========== 检查是否有历史数据并提示 ==========
const checkHasHistoryData = () => {
  const savedData = localStorage.getItem('register_form_data')
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      const hasData = Object.values(data).some(v => v && v.trim())
      if (hasData) {
        ElMessageBox.confirm(
          '检测到您上次填写过注册信息，是否自动填充？',
          '自动填充提示',
          {
            confirmButtonText: '自动填充',
            cancelButtonText: '重新填写',
            type: 'info'
          }
        ).then(() => {
          // 用户确认自动填充，数据已通过 useStorage 自动加载
          ElMessage.success('已自动填充上次填写的信息')
        }).catch(() => {
          // 用户选择重新填写，清空数据
          Object.assign(registerForm.value, {
            username: '',
            password: '',
            realName: '',
            studentId: '',
            email: '',
            phone: ''
          })
          ElMessage.info('已清空，请重新填写')
        })
      }
    } catch (error) {
      console.error('读取历史数据失败:', error)
    }
  }
}

// ========== 页面挂载时检查历史数据 ==========
import { onMounted } from 'vue'
onMounted(() => {
  checkHasHistoryData()
})

// ========== 处理注册 ==========
const handleRegister = async () => {
  try {
    // 1. 表单验证
    await registerFormRef.value.validate()

    // 2. 调用注册接口
    const res = await userRegister(registerForm.value)

    // 3. 注册成功后清空本地存储
    ElMessage.success(res.message || '注册成功')

    // 4. 清空表单和本地存储（保留一段时间以便查看）
    setTimeout(() => {
      localStorage.removeItem('register_form_data')
      Object.assign(registerForm.value, {
        username: '',
        password: '',
        realName: '',
        studentId: '',
        email: '',
        phone: ''
      })
    }, 2000)

    // 5. 跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1000)

  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error('注册失败，请重试')
    }
  }
}

// ========== 跳转到登录页面 ==========
const toLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 整体页面布局 */
.register-page {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

/* 左侧banner区 */
.register-banner {
  flex: 1;
  background: linear-gradient(135deg, #f72585 0%, #4cc9f0 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 40px;
}

.banner-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 600;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

/* 右侧表单区 */
.register-form-wrapper {
  flex: 0 0 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.register-card {
  width: 100%;
  padding: 0 40px;
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
}

.register-title h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.register-title p {
  color: #999;
  font-size: 14px;
}

/* 表单样式 */
.register-form {
  width: 100%;
}

.form-input {
  margin-bottom: 18px;
  border-radius: 8px;
}

.form-actions {
  margin-bottom: 15px;
}

.register-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f72585, #4cc9f0);
  border: none;
  font-size: 16px;
}

/* 登录链接 */
.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-link span {
  color: #f72585;
  cursor: pointer;
  font-weight: 500;
}

.login-link span:hover {
  color: #c71585;
}
</style>