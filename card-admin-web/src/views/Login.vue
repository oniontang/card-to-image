<template>
  <div class="login-wrapper">
    <main class="login-main">
      <section class="login-card">
        <header class="login-head">
          <div class="login-badge">Card Admin</div>
          <h1 class="login-title">管理后台登录</h1>
          <p class="login-subtitle">高效管理智能卡片生成系统</p>
        </header>

        <a-form
          :model="formState"
          name="login"
          autocomplete="off"
          @finish="onFinish"
          layout="vertical"
          class="login-form"
        >
          <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <a-input
              v-model:value="formState.username"
              placeholder="用户名"
              size="large"
            >
              <template #prefix>
                <UserOutlined style="color: var(--muted2)" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password
              v-model:value="formState.password"
              placeholder="密码"
              size="large"
            >
              <template #prefix>
                <LockOutlined style="color: var(--muted2)" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="login-actions">
            <a-checkbox v-model:checked="formState.remember">下次自动登录</a-checkbox>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              size="large"
              block
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <p class="login-footer-text">需要权限？请联系系统管理员</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import request from '../api/request';
import { setAdminToken } from '../constants';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
  remember: false,
});

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    const res = await request.post<any, { accessToken: string }>('/auth/login', {
      username: values.username,
      password: values.password
    });
    setAdminToken(res.accessToken);
    message.success('登录成功');
    router.push('/');
  } catch (error) {
    // 错误由拦截器处理
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  background:
    radial-gradient(120vw 100vh at 50% -20%, rgba(99, 102, 241, 0.12), transparent 60%),
    radial-gradient(100vw 100vh at 0% 100%, rgba(236, 72, 153, 0.08), transparent 60%),
    var(--bg0);
}

.login-main {
  width: 100%;
  max-width: 420px;
  padding: var(--space-xl);
}

.login-card {
  background: var(--surface-strong);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  animation: loginFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes loginFadeIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
}

.login-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 999px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 0 0 1px var(--primary-ring) inset;
}

.login-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.3px;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form :deep(.ant-form-item) {
  margin-bottom: var(--space-lg);
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  font-size: 14px;
  color: var(--muted);
}

.login-footer-text {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--muted2);
}

@media (max-width: 767px) {
  .login-main {
    padding: var(--space-lg);
  }

  .login-card {
    padding: var(--space-xl);
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
