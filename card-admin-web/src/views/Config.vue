<template>
  <div class="config-container">
    <h2>环境配置管理</h2>
    <a-card>
      <a-spin :spinning="loading">
        <a-form layout="vertical">
          <a-form-item label="选择运行环境">
            <a-select
              :value="activeKey"
              @update:value="setActiveKey"
              style="width: 200px"
            >
              <a-select-option value="development">开发环境</a-select-option>
              <a-select-option value="test">测试环境</a-select-option>
              <a-select-option value="production">生产环境</a-select-option>
            </a-select>
          </a-form-item>

          <a-card size="small" title="DashScope 基础配置" style="margin-bottom: 16px">
            <a-form-item label="API Key">
              <a-input-password
                :value="formState.apiKey"
                @update:value="setApiKey"
                placeholder="留空则不修改"
              />
              <div v-if="currentMaskedKey" style="margin-top: var(--space-sm); color: var(--muted2)">
                当前配置的 Key: {{ currentMaskedKey }}
              </div>
            </a-form-item>
            <a-form-item label="Base URL">
              <a-input
                :value="formState.baseUrl"
                @update:value="setBaseUrl"
                placeholder="https://dashscope.aliyuncs.com/api/v1"
              />
            </a-form-item>
          </a-card>

          <!-- ── 文本分析模型 ── -->
          <a-card size="small" title="文本分析模型" style="margin-bottom: 16px">
            <a-row :gutter="12">
              <a-col :span="8">
                <a-form-item label="提供商">
                  <a-select
                    :value="formState.textProvider"
                    @update:value="onTextProviderChange"
                    style="width: 100%"
                  >
                    <a-select-option value="dashscope">通义千问（DashScope）</a-select-option>
                    <a-select-option value="deepseek">DeepSeek</a-select-option>
                    <a-select-option value="volcano">火山引擎（豆包）</a-select-option>
                    <a-select-option value="zhipu">智谱（GLM）</a-select-option>
                    <a-select-option value="minimax">MiniMax</a-select-option>
                    <a-select-option value="xiaomi">小米（MiMo）</a-select-option>
                    <a-select-option value="custom">自定义（OpenAI 兼容）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item label="模型名称">
                  <!-- 自定义模式：自由输入 -->
                  <a-input
                    v-if="formState.textProvider === 'custom'"
                    :value="formState.textModel"
                    @update:value="setTextModel"
                    placeholder="输入模型名称，如 gpt-4o-mini"
                  />
                  <!-- 预设模式：可搜索下拉 -->
                  <a-select
                    v-else
                    :value="formState.textModel"
                    @update:value="setTextModel"
                    style="width: 100%"
                    show-search
                    allow-clear
                    :filter-option="filterOption"
                    :placeholder="textModelPlaceholder"
                  >
                    <a-select-option
                      v-for="m in textModelOptions"
                      :key="m"
                      :value="m"
                    >{{ m }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Base URL">
                  <a-input
                    :value="formState.textBaseUrl"
                    @update:value="setTextBaseUrl"
                    :placeholder="textBaseUrlPlaceholder"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="API Key">
              <a-input-password
                :value="formState.textApiKey"
                @update:value="setTextApiKey"
                placeholder="留空则不修改"
              />
              <div v-if="textMaskedKey" style="margin-top: var(--space-sm); color: var(--muted2)">
                当前配置的 Key: {{ textMaskedKey }}
              </div>
            </a-form-item>
          </a-card>

          <!-- ── 图片生成模型 ── -->
          <a-card size="small" title="图片生成模型" style="margin-bottom: 16px">
            <a-row :gutter="12">
              <a-col :span="8">
                <a-form-item label="提供商">
                  <a-select
                    :value="formState.imageProvider"
                    @update:value="onImageProviderChange"
                    style="width: 100%"
                  >
                    <a-select-option value="dashscope">通义万相（DashScope）</a-select-option>
                    <a-select-option value="volcano">火山引擎（豆包）</a-select-option>
                    <a-select-option value="zhipu">智谱（CogView）</a-select-option>
                    <a-select-option value="custom">自定义（OpenAI 兼容）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-form-item label="模型名称">
                  <a-input
                    v-if="formState.imageProvider === 'custom'"
                    :value="formState.imageModel"
                    @update:value="setImageModel"
                    placeholder="输入模型名称"
                  />
                  <a-select
                    v-else
                    :value="formState.imageModel"
                    @update:value="setImageModel"
                    style="width: 100%"
                    show-search
                    allow-clear
                    :filter-option="filterOption"
                    :placeholder="imageModelPlaceholder"
                  >
                    <a-select-option
                      v-for="m in imageModelOptions"
                      :key="m"
                      :value="m"
                    >{{ m }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Base URL">
                  <a-input
                    :value="formState.imageBaseUrl"
                    @update:value="setImageBaseUrl"
                    :placeholder="imageBaseUrlPlaceholder"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="API Key">
              <a-input-password
                :value="formState.imageApiKey"
                @update:value="setImageApiKey"
                placeholder="留空则不修改"
              />
              <div v-if="imageMaskedKey" style="margin-top: var(--space-sm); color: var(--muted2)">
                当前配置的 Key: {{ imageMaskedKey }}
              </div>
            </a-form-item>
          </a-card>

          <a-row :gutter="16" style="margin-top: 8px">
            <a-col :span="24">
              <a-button type="primary" @click="saveProfile" :loading="saving">保存修改</a-button>
              <a-button @click="testProfile" style="margin-left: 8px" :loading="testing">测试配置</a-button>
            </a-col>
          </a-row>

          <a-alert
            v-if="testResult"
            :type="testResult.passed ? 'success' : 'error'"
            style="margin-top: 16px"
            show-icon
          >
            <template #message>
              {{ testResult.passed ? '配置测试通过' : '配置测试失败' }}
            </template>
            <template #description v-if="testResult.checks && testResult.checks.length">
              <ul>
                <li v-for="(check, index) in testResult.checks" :key="index">
                  {{ check.name }}: {{ check.message }}
                </li>
              </ul>
            </template>
          </a-alert>
        </a-form>
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import request from '../api/request';

/* ── 预设：文本模型（2026年7月最新） ── */
const TEXT_MODELS: Record<string, string[]> = {
  dashscope: ['qwen3.7-max', 'qwen3.7-plus', 'qwen3.7-flash', 'qwen3.7-plus-cc', 'qwen-vl-max', 'qwen-long'],
  deepseek: ['deepseek-v4-flash', 'deepseek-v4-pro', 'deepseek-v4-flash-cc', 'deepseek-v4-pro-cc'],
  volcano: ['doubao-seed-evolving', 'doubao-seed-2.1-pro-32k', 'doubao-seed-2.1-pro-256k', 'doubao-seed-2.1-turbo-32k', 'doubao-seed-2.0-lite', 'doubao-seed-2.0-mini'],
  zhipu: ['glm-5.2', 'glm-5.1', 'glm-5', 'glm-4.7-flash', 'glm-4.6', 'glm-4v-plus'],
  minimax: ['MiniMax-M1', 'MiniMax-Text-01', 'abab6.5s-chat', 'abab6.5-chat'],
  xiaomi: ['MiMo-V2.5', 'MiMo-V2.5-Pro', 'MiMo-V2.5-Flash', 'MiMo-V2-Pro', 'MiMo-Code'],
};

/* ── 预设：图片模型（2026年7月最新） ── */
const IMAGE_MODELS: Record<string, string[]> = {
  dashscope: ['wanx2.1-t2i-turbo', 'wanx2.1-t2i-plus', 'wanx-style-repaint', 'qwen-image-2.0'],
  volcano: ['doubao-seedream-5.0-pro', 'doubao-seedream-5.0-lite', 'doubao-seedream-4.5'],
  zhipu: ['cogview-4', 'cogview-3-plus', 'cogview-3-plus-free'],
};

/* ── 预设：文本 Base URL ── */
const TEXT_BASE_URLS: Record<string, string> = {
  dashscope: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  deepseek: 'https://api.deepseek.com',
  volcano: 'https://ark.cn-beijing.volces.com/api/v3',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4',
  minimax: 'https://api.minimax.chat/v1',
  xiaomi: 'https://api.xiaomimimo.com/v1',
  custom: '',
};

/* ── 预设：图片 Base URL ── */
const IMAGE_BASE_URLS: Record<string, string> = {
  dashscope: 'https://dashscope.aliyuncs.com/api/v1',
  volcano: 'https://ark.cn-beijing.volces.com/api/v3',
  zhipu: 'https://open.bigmodel.cn/api/paas/v4',
  custom: '',
};

const activeKey = ref('development');
const loading = ref(false);
const saving = ref(false);
const testing = ref(false);
const testResult = ref<{
  passed: boolean;
  checks: Array<{ name: string; message: string }>;
} | null>(null);
const currentMaskedKey = ref('');
const textMaskedKey = ref('');
const imageMaskedKey = ref('');

const formState = ref({
  apiKey: '',
  baseUrl: 'https://dashscope.aliyuncs.com/api/v1',

  textProvider: 'dashscope',
  textApiKey: '',
  textBaseUrl: '',
  textModel: 'qwen3.7-max',

  imageProvider: 'dashscope',
  imageApiKey: '',
  imageBaseUrl: '',
  imageModel: 'wanx2.1-t2i-turbo',
});

/* ── 计算属性 ── */
const textModelOptions = computed(() => TEXT_MODELS[formState.value.textProvider] ?? []);
const imageModelOptions = computed(() => IMAGE_MODELS[formState.value.imageProvider] ?? []);
const textModelPlaceholder = computed(() =>
  formState.value.textProvider === 'custom'
    ? '输入模型名称'
    : `请选择模型（${formState.value.textProvider}）`,
);
const imageModelPlaceholder = computed(() =>
  formState.value.imageProvider === 'custom'
    ? '输入模型名称'
    : `请选择模型（${formState.value.imageProvider}）`,
);
const textBaseUrlPlaceholder = computed(() =>
  TEXT_BASE_URLS[formState.value.textProvider] || '请输入 OpenAI 兼容的 Base URL',
);
const imageBaseUrlPlaceholder = computed(() =>
  IMAGE_BASE_URLS[formState.value.imageProvider] || '请输入 OpenAI 兼容的 Base URL',
);

const filterOption = (input: string, option: { key: string }) => {
  return option.key.toLowerCase().includes(input.toLowerCase());
};

/* ── 提供商切换联动 ── */
const onTextProviderChange = (v: string) => {
  formState.value.textProvider = v;
  const presetUrl = TEXT_BASE_URLS[v];
  if (presetUrl) {
    formState.value.textBaseUrl = presetUrl;
  }
  const models = TEXT_MODELS[v];
  if (models && models.length > 0 && !models.includes(formState.value.textModel)) {
    formState.value.textModel = models[0];
  } else if (v === 'custom') {
    formState.value.textModel = '';
  }
};

const onImageProviderChange = (v: string) => {
  formState.value.imageProvider = v;
  const presetUrl = IMAGE_BASE_URLS[v];
  if (presetUrl) {
    formState.value.imageBaseUrl = presetUrl;
  }
  const models = IMAGE_MODELS[v];
  if (models && models.length > 0 && !models.includes(formState.value.imageModel)) {
    formState.value.imageModel = models[0];
  } else if (v === 'custom') {
    formState.value.imageModel = '';
  }
};

const setActiveKey = (v: string) => {
  activeKey.value = v;
  fetchProfile();
};

const setApiKey = (v: string) => {
  formState.value.apiKey = v;
};

const setBaseUrl = (v: string) => {
  formState.value.baseUrl = v;
};

const setTextApiKey = (v: string) => {
  formState.value.textApiKey = v;
};

const setTextBaseUrl = (v: string) => {
  formState.value.textBaseUrl = v;
};

const setTextModel = (v: string) => {
  formState.value.textModel = v;
};

const setImageApiKey = (v: string) => {
  formState.value.imageApiKey = v;
};

const setImageBaseUrl = (v: string) => {
  formState.value.imageBaseUrl = v;
};

const setImageModel = (v: string) => {
  formState.value.imageModel = v;
};

const fetchProfile = async () => {
  loading.value = true;
  testResult.value = null;
  try {
    const res = await request.get<any, any>(
      `/ai/providers/dashscope/profiles/${activeKey.value}`,
    );

    currentMaskedKey.value = res?.apiKeyMasked || '未配置';
    textMaskedKey.value = res?.textApiKeyMasked || '未配置';
    imageMaskedKey.value = res?.imageApiKeyMasked || '未配置';

    formState.value.apiKey = '';
    formState.value.baseUrl = res?.baseUrl || formState.value.baseUrl;

    formState.value.textProvider = res?.textProvider || formState.value.textProvider;
    formState.value.textApiKey = '';
    formState.value.textBaseUrl = res?.textBaseUrl || formState.value.textBaseUrl;
    formState.value.textModel = res?.textModel || formState.value.textModel;

    formState.value.imageProvider = res?.imageProvider || formState.value.imageProvider;
    formState.value.imageApiKey = '';
    formState.value.imageBaseUrl = res?.imageBaseUrl || formState.value.imageBaseUrl;
    formState.value.imageModel = res?.imageModel || formState.value.imageModel;
  } catch (error) {
    // 错误由拦截器处理
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  const payload: Record<string, string | null> = {
    baseUrl: formState.value.baseUrl || null,

    textProvider: formState.value.textProvider || null,
    textBaseUrl: formState.value.textBaseUrl || null,
    textModel: formState.value.textModel || null,

    imageProvider: formState.value.imageProvider || null,
    imageBaseUrl: formState.value.imageBaseUrl || null,
    imageModel: formState.value.imageModel || null,
  };

  if (formState.value.apiKey && formState.value.apiKey.trim()) {
    payload.apiKey = formState.value.apiKey.trim();
  }
  if (formState.value.textApiKey && formState.value.textApiKey.trim()) {
    payload.textApiKey = formState.value.textApiKey.trim();
  }
  if (formState.value.imageApiKey && formState.value.imageApiKey.trim()) {
    payload.imageApiKey = formState.value.imageApiKey.trim();
  }

  saving.value = true;
  try {
    await request.post(
      `/ai/providers/dashscope/profiles/${activeKey.value}`,
      payload,
    );
    message.success('保存成功');
    fetchProfile();
  } catch (error) {
    // 错误由拦截器处理
  } finally {
    saving.value = false;
  }
};

const testProfile = async () => {
  testing.value = true;
  try {
    const res = await request.post<any, any>(
      `/ai/providers/dashscope/profiles/${activeKey.value}/test`,
    );
    testResult.value = {
      passed: Boolean(res?.passed),
      checks: Array.isArray(res?.checks) ? res.checks : [],
    };
    if (res?.passed) {
      message.success('配置测试通过');
    } else {
      message.error('配置测试失败，请检查提示信息');
    }
  } catch (error) {
    // 错误由拦截器处理
  } finally {
    testing.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});
</script>

<style scoped>
.config-container {
  padding: var(--space-xl);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.config-container :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: var(--muted);
}

.config-container :deep(.ant-card) {
  margin-bottom: var(--space-lg);
}

.config-container :deep(.ant-card-head-title) {
  font-weight: 700;
  color: var(--text);
}

.config-container h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-lg);
}
</style>
