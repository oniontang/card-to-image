<template>
  <a-layout style="min-height: 100vh" class="layout-container">
    <!-- 桌面端：固定侧边栏 -->
    <a-layout-sider
      v-if="!isMobile"
      :collapsed="collapsed"
      class="custom-sider"
      width="220"
      :trigger="null"
      collapsible
    >
      <div class="logo">
        <h2 class="logo-title" v-if="!collapsed">Card Server</h2>
        <h2 class="logo-title-mini" v-else>CS</h2>
      </div>
      <a-menu :selectedKeys="selectedKeys" @update:selectedKeys="selectedKeys = $event" mode="inline" class="custom-menu" @select="onMenuSelect">
        <a-menu-item key="dashboard" class="menu-item">
          <home-outlined />
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="config" class="menu-item">
          <setting-outlined />
          <span>环境配置管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 移动端：抽屉式侧边栏 -->
    <a-drawer
      v-if="isMobile"
      :open="drawerVisible"
      placement="left"
      :width="220"
      :body-style="{ padding: '0', background: 'linear-gradient(180deg, var(--surface-solid) 0%, var(--bg0) 100%)' }"
      :header-style="{ display: 'none' }"
      @close="drawerVisible = false"
    >
      <div class="logo">
        <h2 class="logo-title">Card Server</h2>
      </div>
      <a-menu :selectedKeys="selectedKeys" @update:selectedKeys="selectedKeys = $event" mode="inline" class="custom-menu" @select="onMenuSelect">
        <a-menu-item key="dashboard" class="menu-item">
          <home-outlined />
          <span>首页</span>
        </a-menu-item>
        <a-menu-item key="config" class="menu-item">
          <setting-outlined />
          <span>环境配置管理</span>
        </a-menu-item>
      </a-menu>
    </a-drawer>

    <a-layout class="main-layout">
      <a-layout-header class="custom-header">
        <div class="header-left">
          <!-- 移动端：汉堡菜单按钮 -->
          <menu-outlined
            v-if="isMobile"
            class="trigger"
            @click="drawerVisible = true"
          />
          <!-- 桌面端：折叠/展开按钮 -->
          <menu-unfold-outlined
            v-else-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        </div>
        <div class="header-right">
        <a-dropdown>
          <a class="ant-dropdown-link user-dropdown" @click.prevent>
            <div class="user-avatar">
              <user-outlined />
            </div>
            <span class="user-name" v-if="!isMobile">管理员</span>
            <down-outlined class="dropdown-icon" v-if="!isMobile" />
          </a>
          <template #overlay>
            <a-menu class="user-menu">
              <a-menu-item @click="handleLogout">
                <logout-outlined /> 退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout class="content-layout">
      <a-layout-content class="custom-content">
          <div class="content-wrapper">
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer class="custom-footer">
          Card Server Admin ©2026 Created by Tangkunhu
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  HomeOutlined,
  SettingOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined
} from '@ant-design/icons-vue';
import { clearAdminToken } from '../constants';

const router = useRouter();
const route = useRoute();

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['dashboard']);
const isMobile = ref<boolean>(false);
const drawerVisible = ref<boolean>(false);

// 响应式断点检测
const MOBILE_BREAKPOINT = 768;

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
});

watchEffect(() => {
  const path = route.path;
  if (path.includes('dashboard')) {
    selectedKeys.value = ['dashboard'];
  } else if (path.includes('config')) {
    selectedKeys.value = ['config'];
  }
});

const onMenuSelect = ({ key }: { key: string }) => {
  if (key === 'dashboard') {
    router.push('/dashboard');
  } else if (key === 'config') {
    router.push('/config');
  }
  // 移动端选择后自动关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false;
  }
};

const handleLogout = () => {
  clearAdminToken();
  router.push('/login');
};
</script>

<style scoped>
/* 整体布局样式 */
.layout-container {
  background-color: var(--bg0);
  font-family: var(--font-sans);
}

.main-layout {
  background-color: var(--bg0);
}

/* 左侧边栏 - 简约毛玻璃风格 */
.custom-sider {
  background: linear-gradient(180deg, var(--surface-strong) 0%, var(--surface) 100%) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.03);
  z-index: 10;
  border-right: 1px solid var(--border);
}

:deep(.ant-layout-sider-trigger) {
  background: var(--surface-solid) !important;
  color: var(--muted) !important;
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  transition: all 0.3s;
}

:deep(.ant-layout-sider-trigger:hover) {
  color: var(--primary) !important;
  background: var(--primary-light) !important;
}

/* Logo 区域 */
.logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-lg);
  margin-bottom: var(--space-sm);
}

.logo-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.logo-title-mini {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
}

/* 简约风菜单样式 */
.custom-menu {
  background: transparent !important;
  border-right: none !important;
  padding: var(--space-sm);
}

:deep(.ant-menu-item) {
  height: 44px !important;
  line-height: 44px !important;
  margin-bottom: var(--space-sm) !important;
  border-radius: var(--radius-sm) !important;
  color: var(--muted) !important;
  transition: all 0.25s ease !important;
}

:deep(.ant-menu-item .anticon) {
  font-size: 16px !important;
  transition: all 0.25s ease;
}

:deep(.ant-menu-item:hover) {
  color: var(--primary) !important;
  background-color: var(--primary-light) !important;
}

:deep(.ant-menu-item-selected) {
  color: var(--surface-solid) !important;
  background: var(--primary-gradient) !important;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25) !important;
  font-weight: 500;
}

:deep(.ant-menu-item-selected .anticon) {
  color: var(--surface-solid) !important;
}

.trigger {
  font-size: 18px;
  line-height: var(--header-height);
  cursor: pointer;
  transition: color 0.3s;
  color: var(--muted);
}

.trigger:hover {
  color: var(--primary);
}

/* 顶部 Header */
.custom-header {
  background: var(--surface-strong);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  padding: 0 var(--space-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  box-shadow: var(--shadow-xs);
  z-index: 9;
  border-bottom: 1px solid var(--border);
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-xs);
  transition: background 0.3s;
}

.user-dropdown:hover {
  background: var(--bg0);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-sm);
  font-size: 16px;
}

.user-name {
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  margin-right: var(--space-xs);
}

.dropdown-icon {
  color: var(--muted2);
  font-size: 12px;
}

.user-menu {
  border-radius: var(--radius-sm);
  padding: var(--space-xs);
}

:deep(.user-menu .ant-menu-item) {
  border-radius: var(--radius-xs);
  padding: var(--space-sm) var(--space-lg);
}

:deep(.user-menu .ant-menu-item:hover) {
  background-color: var(--danger-light) !important;
  color: var(--danger-text) !important;
}

/* 内容区域 */
.custom-content {
  margin: var(--space-lg);
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  background: transparent;
  min-height: 360px;
}

/* 页脚 */
.custom-footer {
  text-align: center;
  color: var(--muted2);
  font-size: 13px;
  padding: var(--space-lg);
  background: transparent;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .custom-header {
    padding: 0 var(--space-lg);
  }

  .custom-content {
    margin: var(--space-sm);
  }

  .custom-footer {
    font-size: 12px;
    padding: var(--space-md);
  }
}
</style>
