<template>
  <a-spin :spinning="loading" tip="加载中...">
  <div class="home-container">
    <!-- 顶部四个统计卡片 -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="top-card" :bordered="false">
          <div class="card-content">
            <div class="icon-box blue-box">
              <user-outlined />
            </div>
            <div class="info-box">
              <div class="title">总用户数</div>
              <div class="value">{{ formatNumber(stats.users.total) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="top-card" :bordered="false">
          <div class="card-content">
            <div class="icon-box yellow-box">
              <user-add-outlined />
            </div>
            <div class="info-box">
              <div class="title">今日新增用户</div>
              <div class="value">{{ formatNumber(stats.users.todayNew) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="top-card" :bordered="false">
          <div class="card-content">
            <div class="icon-box green-box">
              <api-outlined />
            </div>
            <div class="info-box">
              <div class="title">模型总调用量</div>
              <div class="value">{{ formatNumber(stats.calls.total) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card class="top-card" :bordered="false">
          <div class="card-content">
            <div class="icon-box purple-box">
              <pay-circle-outlined />
            </div>
            <div class="info-box">
              <div class="title">总消耗积分</div>
              <div class="value">{{ formatYuan(stats.cost.totalYuan) }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="mt-16">
      <!-- 左侧主要内容区域 -->
      <a-col :xs="24" :lg="18">
        <!-- 中间左右结构：概览指标与图表 -->
        <a-row :gutter="[16, 16]">
          <!-- 左侧概览指标 -->
          <a-col :xs="24" :md="8">
            <a-card :bordered="false" class="overview-card full-height" :bodyStyle="{ padding: '20px 24px', height: '100%' }">
              <div class="card-header">
                <span class="card-title">本月概览</span>
                <span class="card-subtitle">更新于 {{ currentDate }}</span>
              </div>
              <div class="overview-grid-vertical mt-16">
                <div class="grid-item primary-item mb-16">
                  <div class="item-title">本月消耗积分</div>
                  <div class="item-main-value">{{ formatYuan(stats.cost.monthlyYuan) }}</div>
                  <div class="item-sub">
                    <span>较前1月 <span class="up-text">↑ 0.01</span></span>
                  </div>
                  <div class="item-footer mt-8">
                    <span class="footer-label">今日消耗</span>
                    <span class="footer-val">{{ formatYuan(stats.cost.todayYuan) }}</span>
                  </div>
                </div>
                <div class="grid-item mb-16">
                  <div class="item-title">平均调用成本 (分/次)</div>
                  <div class="item-main-value">{{ avgCostPerCall }}</div>
                </div>
                <div class="grid-item mb-16">
                  <div class="item-title">本月调用次数</div>
                  <div class="item-main-value">{{ formatNumber(stats.calls.monthly) }}</div>
                  <div class="item-sub">
                    <span>较前1天 持平</span>
                  </div>
                  <div class="item-footer mt-8">
                    <span class="footer-label">今日调用</span>
                    <span class="footer-val">{{ formatNumber(stats.calls.today) }}</span>
                  </div>
                </div>
                <div class="grid-item">
                  <div class="item-title">调用成功率</div>
                  <div class="item-main-value">{{ formatPercent(stats.calls.successRate) }}</div>
                </div>
              </div>
            </a-card>
          </a-col>
          
          <!-- 右侧积分消耗趋势图 -->
          <a-col :xs="24" :md="16">
            <a-card :bordered="false" class="chart-card full-height" :bodyStyle="{ padding: '20px 24px', height: '100%' }">
              <div class="card-header">
                <span class="card-title">本月积分消耗趋势</span>
                <a class="more-link">查看更多 ></a>
              </div>
              <div ref="monthChartRef" class="chart-container mt-16" style="height: 360px;"></div>
            </a-card>
          </a-col>
        </a-row>

        <!-- 底部图表区域 -->
        <a-row :gutter="[16, 16]" class="mt-16">
          <a-col :xs="24" :md="12">
            <a-card :bordered="false" class="chart-card">
              <div class="card-header">
                <span class="card-title">总消耗趋势分析</span>
              </div>
              <div ref="trendChartRef" class="small-chart-container mt-16"></div>
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card :bordered="false" class="chart-card">
              <div class="card-header">
                <span class="card-title">各模型调用量排名 (次)</span>
              </div>
              <div ref="rankChartRef" class="small-chart-container mt-16"></div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>

      <!-- 右侧侧边栏区域 -->
      <a-col :xs="24" :lg="6">
        <!-- 用户信息卡片 -->
        <a-card :bordered="false" class="profile-card" :bodyStyle="{ padding: '20px' }">
          <div class="profile-info">
            <a-avatar :size="48" shape="square" class="profile-avatar">
              <template #icon><user-outlined /></template>
            </a-avatar>
            <div class="profile-detail">
              <div class="profile-name">admin</div>
              <div class="profile-tags">
                <a-tag color="blue" class="custom-tag">超级管理员</a-tag>
                <a-tag color="cyan" class="custom-tag">系统管理员</a-tag>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 卡片生成数据 -->
        <a-card :bordered="false" class="mt-16 stats-card" :bodyStyle="{ padding: '20px' }">
          <div class="card-header no-margin">
            <span class="card-title">总生成卡片数</span>
            <a class="more-link">生成详情 ></a>
          </div>
          <div class="huge-value mt-16">{{ formatNumber(stats.cards.totalGenerated) }}</div>
          <div class="stats-desc mb-16">
            <span>较前1周 <span class="up-text">↑ 0.01</span></span>
            <span class="ml-16">高于 28.90% 的同行</span>
          </div>
          
          <!-- 迷你折线图 -->
          <div ref="miniChartRef" class="mini-chart-container mb-16"></div>

          <a-row class="stats-row text-center">
            <a-col :span="8">
              <div class="stat-label">日生成数</div>
              <div class="stat-num">30</div>
              <div class="stat-compare">较前1天 持平</div>
            </a-col>
            <a-col :span="8">
              <div class="stat-label">周生成数</div>
              <div class="stat-num">88</div>
              <div class="stat-compare">较前1周 <span class="up-text">↑ 0.01</span></div>
            </a-col>
            <a-col :span="8">
              <div class="stat-label">月生成数</div>
              <div class="stat-num">388</div>
              <div class="stat-compare">较前1月 <span class="down-text">↓ 0.02</span></div>
            </a-col>
          </a-row>

          <a-divider style="margin: 16px 0;" />
          
          <div class="card-header no-margin mb-12">
            <span class="card-title" style="font-size: 14px;">异常情况</span>
            <a class="more-link">查看更多 ></a>
          </div>
          <div class="alert-item">
            <div class="alert-icon"><close-circle-filled style="color: var(--danger)" /></div>
            <div class="alert-text">通义千问模型额度不足100次，请尽快补充</div>
            <a class="alert-action">查看</a>
          </div>
        </a-card>

        <!-- 常用功能 -->
        <a-card :bordered="false" class="mt-16 func-card" :bodyStyle="{ padding: '20px' }">
          <div class="card-header mb-16">
            <span class="card-title">常用功能</span>
          </div>
          <a-row :gutter="[16, 16]">
            <a-col :span="12" v-for="(item, index) in commonFunctions" :key="index">
              <div class="func-item">
                <component :is="item.icon" :style="{ color: item.color, fontSize: '18px' }" class="func-icon" />
                <span class="func-name">{{ item.name }}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue';
import * as echarts from 'echarts';
import {
  UserOutlined,
  UserAddOutlined,
  ApiOutlined,
  PayCircleOutlined,
  SettingOutlined,
  DashboardOutlined,
  ProfileOutlined,
  SafetyCertificateOutlined,
  CloseCircleFilled
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import request from '../api/request';

const currentDate = ref(dayjs().format('YYYY.MM.DD'));

// 加载状态
const loading = ref(false);

// Dashboard 统计数据
const stats = ref({
  users: { total: 0, todayNew: 0 },
  calls: { total: 0, monthly: 0, today: 0, successRate: 0 },
  cost: { totalYuan: 0, monthlyYuan: 0, todayYuan: 0 },
  cards: { totalGenerated: 0 },
  modelRanking: [] as Array<{ model: string; count: number }>,
  dailyTrend: [] as Array<{ date: string; calls: number; cost: number }>,
});

// 数字格式化:千分位
const formatNumber = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '0';
  return Number(val).toLocaleString();
};

// 金额格式化:千分位 + 两位小数
const formatYuan = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '0.00';
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// 百分比格式化 (传入 0~1 的小数)
const formatPercent = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '0%';
  return (Number(val) * 100).toFixed(1) + '%';
};

// 平均调用成本 (分/次) = 总成本(元) / 总调用次数 * 100
const avgCostPerCall = computed(() => {
  const totalCalls = stats.value.calls.total;
  const totalCost = stats.value.cost.totalYuan;
  if (!totalCalls || totalCalls === 0) return '0.00';
  return ((totalCost / totalCalls) * 100).toFixed(2);
});

// DOM refs for charts
const monthChartRef = ref<HTMLElement | null>(null);
const trendChartRef = ref<HTMLElement | null>(null);
const rankChartRef = ref<HTMLElement | null>(null);
const miniChartRef = ref<HTMLElement | null>(null);

// Echarts instances
const monthChart = shallowRef<echarts.ECharts | null>(null);
const trendChart = shallowRef<echarts.ECharts | null>(null);
const rankChart = shallowRef<echarts.ECharts | null>(null);
const miniChart = shallowRef<echarts.ECharts | null>(null);

const commonFunctions = [
  { name: '用户管理', icon: UserOutlined, color: '#8b5cf6' },
  { name: '模型配置', icon: ApiOutlined, color: '#3b82f6' },
  { name: '日志查询', icon: ProfileOutlined, color: '#ef4444' },
  { name: '环境设置', icon: SettingOutlined, color: '#f59e0b' },
  { name: '系统监控', icon: DashboardOutlined, color: '#06b6d4' },
  { name: '安全防护', icon: SafetyCertificateOutlined, color: '#10b981' }
];

// 获取 Dashboard 统计数据
const fetchStats = async () => {
  loading.value = true;
  try {
    const res = await request.get<any, any>('/stats');
    if (res) {
      stats.value = res;
    }
  } catch (error) {
    // 错误由响应拦截器处理,保留原有 UI 结构
  } finally {
    loading.value = false;
  }
};

// 初始化图表
const initCharts = () => {
  // 1. 本月积分消耗趋势 (折线图)
  if (monthChartRef.value) {
    const trendData = stats.value.dailyTrend || [];
    monthChart.value = echarts.init(monthChartRef.value);
    monthChart.value.setOption({
      grid: { top: 20, right: 10, bottom: 20, left: 40 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: trendData.map((item) => item.date),
        axisLine: { lineStyle: { color: '#e5e6eb' } },
        axisLabel: { color: '#86909c' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e5e6eb' } },
        axisLabel: { color: '#86909c' }
      },
      series: [{
        data: trendData.map((item) => item.cost),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f46e5', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 70, 229, 0.2)' },
            { offset: 1, color: 'rgba(79, 70, 229, 0.01)' }
          ])
        }
      }]
    });
  }

  // 2. 总消耗趋势分析 (双折线图)
  if (trendChartRef.value) {
    const trendData = stats.value.dailyTrend || [];
    trendChart.value = echarts.init(trendChartRef.value);
    trendChart.value.setOption({
      grid: { top: 20, right: 10, bottom: 20, left: 40 },
      tooltip: { trigger: 'axis' },
      legend: { data: ['消耗(元)', '调用次数'], icon: 'circle', itemWidth: 8, itemHeight: 8, top: 0, right: 0 },
      xAxis: {
        type: 'category',
        data: trendData.map((item) => item.date),
        axisLine: { lineStyle: { color: '#e5e6eb' } },
        axisLabel: { color: '#86909c', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#e5e6eb' } },
        axisLabel: { color: '#86909c', fontSize: 10 }
      },
      series: [
        {
          name: '消耗(元)',
          data: trendData.map((item) => item.cost),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#4f46e5' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79, 70, 229, 0.15)' },
              { offset: 1, color: 'rgba(79, 70, 229, 0)' }
            ])
          }
        },
        {
          name: '调用次数',
          data: trendData.map((item) => item.calls),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#6366f1' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(99, 102, 241, 0.15)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0)' }
            ])
          }
        }
      ]
    });
  }

  // 3. 各模型调用排名 (条形图)
  if (rankChartRef.value) {
    const rankingData = stats.value.modelRanking || [];
    rankChart.value = echarts.init(rankChartRef.value);
    rankChart.value.setOption({
      grid: { top: 10, right: 30, bottom: 10, left: 80, containLabel: true },
      xAxis: { type: 'value', show: false },
      yAxis: {
        type: 'category',
        inverse: true,
        data: rankingData.map((item) => item.model),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#4e5969', fontSize: 12 }
      },
      series: [{
        type: 'bar',
        data: rankingData.map((item) => item.count),
        barWidth: 12,
        itemStyle: {
          color: '#4f46e5',
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: '#86909c',
          fontSize: 12
        }
      }]
    });
  }

  // 4. 迷你折线图
  if (miniChartRef.value) {
    const trendData = stats.value.dailyTrend || [];
    miniChart.value = echarts.init(miniChartRef.value);
    miniChart.value.setOption({
      grid: { top: 5, right: 0, bottom: 5, left: 0 },
      xAxis: { type: 'category', show: false, data: trendData.map((item) => item.date) },
      yAxis: { type: 'value', show: false },
      series: [{
        data: trendData.map((item) => item.calls),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#4f46e5', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 70, 229, 0.2)' },
            { offset: 1, color: 'rgba(79, 70, 229, 0)' }
          ])
        }
      }]
    });
  }
};

const resizeCharts = () => {
  monthChart.value?.resize();
  trendChart.value?.resize();
  rankChart.value?.resize();
  miniChart.value?.resize();
};

onMounted(async () => {
  // 先获取统计数据,再初始化图表
  await fetchStats();
  // Add a small delay to ensure DOM is fully rendered for echarts
  setTimeout(() => {
    initCharts();
    window.addEventListener('resize', resizeCharts);
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts);
  monthChart.value?.dispose();
  trendChart.value?.dispose();
  rankChart.value?.dispose();
  miniChart.value?.dispose();
});
</script>

<style scoped>
.home-container {
  min-height: 100%;
  padding: var(--space-xl);
  max-width: var(--content-max-width);
  margin: 0 auto;
  background-color: var(--bg0);
  font-family: var(--font-sans);
}

.mt-16 { margin-top: var(--space-lg); }
.mb-16 { margin-bottom: var(--space-lg); }
.mb-12 { margin-bottom: var(--space-md); }
.ml-16 { margin-left: var(--space-lg); }
.no-margin { margin: 0 !important; }
.text-center { text-align: center; }
.up-text { color: var(--danger-text); }
.down-text { color: var(--success); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.card-subtitle {
  font-size: 12px;
  color: var(--muted2);
  margin-left: var(--space-md);
  font-weight: normal;
}
.more-link {
  font-size: 13px;
  color: var(--muted2);
}
.more-link:hover { color: var(--primary); }

/* 顶部卡片 */
.top-card .card-content {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-xs);
}
.icon-box {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: var(--space-lg);
}
.blue-box { background: var(--primary-light); color: var(--primary); }
.yellow-box { background: var(--warning-light); color: var(--warning); }
.green-box { background: var(--success-light); color: var(--success); }
.purple-box { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.info-box {
  display: flex;
  flex-direction: column;
}
.info-box .title {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: var(--space-xs);
}
.info-box .value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

/* 本月概览 网格 */
.overview-grid-vertical {
  display: flex;
  flex-direction: column;
}

.full-height {
  height: 100%;
}

.grid-item {
  background: var(--bg0);
  border-radius: var(--radius-sm);
  padding: var(--space-lg);
  transition: all 0.3s;
}

.primary-item {
  background: var(--primary-gradient);
  color: white;
}
.item-title {
  font-size: 13px;
  color: var(--muted2);
  margin-bottom: var(--space-sm);
}
.primary-item .item-title,
.primary-item .item-sub,
.primary-item .footer-label {
  color: rgba(255, 255, 255, 0.8);
}
.primary-item .item-main-value {
  color: var(--surface-solid);
}
.item-main-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  font-family: var(--font-sans);
  margin-bottom: var(--space-sm);
}
.item-sub {
  font-size: 12px;
  color: var(--muted2);
  margin-bottom: var(--space-md);
}
.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
  font-size: 13px;
}
.primary-item .item-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.footer-label { color: var(--muted); }
.footer-val { font-weight: 600; color: var(--text); }
.primary-item .footer-val {
  color: var(--surface-solid);
}

/* 图表容器 */
.chart-header {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: var(--space-sm);
}
.chart-container {
  height: 280px;
  width: 100%;
}
.small-chart-container {
  height: 220px;
  width: 100%;
}
.mini-chart-container {
  height: 60px;
  width: 100%;
}

/* 右侧侧边栏 */
.profile-info {
  display: flex;
  align-items: center;
}
.profile-avatar {
  border-radius: var(--radius-md);
  background: var(--primary);
}
.profile-detail {
  margin-left: var(--space-lg);
}
.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-xs);
}
.custom-tag {
  border: none;
  border-radius: var(--radius-xs);
  margin-right: var(--space-xs);
}

.huge-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stats-desc {
  font-size: 12px;
  color: var(--muted2);
}

.stat-label {
  font-size: 12px;
  color: var(--muted2);
  margin-bottom: var(--space-xs);
}
.stat-num {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-xs);
}
.stat-compare {
  font-size: 10px;
  color: var(--muted2);
  white-space: nowrap;
  transform: scale(0.9);
}

.alert-item {
  display: flex;
  align-items: center;
  background: var(--danger-light);
  padding: 10px var(--space-md);
  border-radius: var(--radius-xs);
}
.alert-icon {
  margin-right: var(--space-sm);
  display: flex;
}
.alert-text {
  font-size: 12px;
  color: var(--text);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.alert-action {
  font-size: 12px;
  color: var(--primary);
  margin-left: var(--space-sm);
}

.func-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm);
  cursor: pointer;
  border-radius: var(--radius-xs);
  transition: background 0.2s;
}
.func-item:hover {
  background: var(--border);
}
.func-icon {
  margin-right: var(--space-sm);
  background: var(--bg0);
  padding: 6px;
  border-radius: 50%;
}
.func-name {
  font-size: 13px;
  color: var(--muted);
}
</style>