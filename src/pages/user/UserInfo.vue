<template>
  <div class="user-info-container">
    <!-- 顶部操作栏：退出登录按钮 -->
    <div class="top-actions">
      <el-button 
        type="danger" 
        plain 
        @click="handleLogout"
        class="logout-btn"
      >
        退出登录
      </el-button>
    </div>

    <!-- 个人信息卡片（美化） -->
    <el-card 
      title="个人信息详情" 
      shadow="hover" 
      class="info-card"
      style="border-radius: 12px; overflow: hidden;"
    >
      <!-- 卡片标题自定义美化 -->
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><User /></el-icon>
          <span class="header-title">个人信息详情</span>
        </div>
      </template>

      <el-form
        ref="userInfoFormRef"
        :model="userInfo"
        label-width="100px"
        class="info-form"
        size="medium"
      >
        <el-row :gutter="24"> <!-- 增加列间距更美观 -->
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" class="form-item">
              <el-input 
                v-model="userInfo.username" 
                disabled
                placeholder="暂无用户名"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId" class="form-item">
              <el-input 
                v-model="userInfo.studentId" 
                disabled
                placeholder="暂无学号"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName" class="form-item">
              <el-input 
                v-model="userInfo.realName" 
                placeholder="请输入真实姓名"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" class="form-item">
              <el-input 
                v-model="userInfo.email" 
                placeholder="请输入邮箱"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone" class="form-item">
              <el-input 
                v-model="userInfo.phone" 
                placeholder="请输入手机号"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role" class="form-item">
              <el-input 
                v-model="userInfo.role" 
                disabled
                placeholder="暂无角色信息"
                class="form-input"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="btn-group">
          <el-button 
            type="primary" 
            @click="handleUpdateUserInfo"
            class="submit-btn"
          >
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router' // 引入路由
import { User } from '@element-plus/icons-vue' // 引入用户图标
import { getUserInfo, updateUserInfo } from '@/api/user'
import { useUserStore } from '@/pinia/userStore'

const userStore = useUserStore()
const router = useRouter() // 初始化路由
const userInfoFormRef = ref(null)
const userInfo = ref({
  username: '',
  realName: '',
  studentId: '',
  email: '',
  phone: '',
  role: ''
})

// 获取个人信息
const getUserInfoData = async () => {
  try {
    const res = await getUserInfo()
    userInfo.value = res.data // 赋值用户信息
  } catch (error) {
    console.error('获取个人信息失败：', error)
    ElMessage.error('获取个人信息失败')
  }
}

// 修改个人信息
const handleUpdateUserInfo = async () => {
  try {
    await userInfoFormRef.value.validate()
    await updateUserInfo(userInfo.value)
    ElMessage.success('修改个人信息成功')
    // 刷新pinia中的用户信息
    getUserInfoData()
  } catch (error) {
    console.error('修改个人信息失败：', error)
    ElMessage.error('修改个人信息失败')
  }
}

// 退出登录逻辑（带确认弹窗）
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cancel-btn'
      }
    )
    // 清空Pinia用户状态
    userStore.logout() // 确保userStore中有logout方法清空token/用户信息
    // 跳转到登录页（根据项目实际登录页路径调整）
    router.push('/login')
    ElMessage.success('退出登录成功')
  } catch (error) {
    ElMessage.info('已取消退出')
  }
}

onMounted(() => {
  getUserInfoData()
})
</script>

<style scoped>
/* 容器整体样式 */
.user-info-container {
  padding: 30px;
  background-color: #f7f8fa;
  min-height: calc(100vh - 120px);
}

/* 顶部退出按钮栏 */
.top-actions {
  text-align: right;
  margin-bottom: 20px;
}
.logout-btn {
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
}
.logout-btn:hover {
  background-color: #fef0f0;
  color: #e4393c;
}

/* 信息卡片样式 */
.info-card {
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: none;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-icon {
  font-size: 20px;
  color: #409eff;
}
.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 表单样式 */
.info-form {
  margin-top: 25px;
  padding: 0 10px;
}
.form-item {
  margin-bottom: 20px;
}
.form-input {
  border-radius: 8px;
  height: 42px;
  border: 1px solid #e6e6e6;
  transition: all 0.3s;
}
/* 禁用输入框美化 */
:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f8f9fa;
  color: #606266;
  cursor: not-allowed;
  border-color: #e6e6e6;
}
/* 输入框hover/聚焦样式 */
:deep(.el-input__inner:hover) {
  border-color: #c0c4cc;
}
:deep(.el-input__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 按钮组样式 */
.btn-group {
  text-align: center;
  margin-top: 35px;
}
.submit-btn {
  padding: 10px 30px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #409eff;
  border: none;
}
.submit-btn:hover {
  background-color: #66b1ff;
}

/* 弹窗按钮样式（可选） */
:deep(.confirm-btn) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}
:deep(.cancel-btn) {
  background-color: #fff;
  color: #606266;
  border-color: #dcdfe6;
}
</style>