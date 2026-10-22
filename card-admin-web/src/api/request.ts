import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import router from '../router';
import { getAdminToken, clearAdminToken } from '../constants';

/** 后端统一响应体: { code, mes, data } */
type ApiResponse<T = unknown> = {
  code: number;
  mes: string;
  data: T | null;
};

const request = axios.create({
  baseURL:
    import.meta.env.VITE_ADMIN_API_BASE?.replace(/\/$/, '') ?? '/api/admin',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const body = response.data;

    // 成功: code === 0, 解包 data 层
    if (body.code === 0) {
      return body.data as unknown as AxiosResponse;
    }

    // 业务错误: code !== 0, 走错误流程
    if (body.code === 8001 || body.code === 8003) {
      clearAdminToken();
      message.error(body.mes || '登录已过期，请重新登录');
      router.push('/login');
    } else {
      message.error(body.mes || '请求失败');
    }

    return Promise.reject(new Error(body.mes || '请求失败'));
  },
  (error) => {
    if (error.response) {
      const body = error.response.data as ApiResponse | undefined;

      if (error.response.status === 401) {
        clearAdminToken();
        message.error(body?.mes || '登录已过期，请重新登录');
        router.push('/login');
      } else {
        const msg = body?.mes || '请求失败';
        message.error(Array.isArray(msg) ? msg.join(', ') : msg);
      }
    } else {
      message.error('网络错误，请检查连接');
    }
    return Promise.reject(error);
  },
);

export default request;
