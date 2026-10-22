/** Admin 后台通用的 localStorage key 与配置常量 */
export const ADMIN_TOKEN_KEY = "cardServerAdminWebAccessToken";

/** 获取 Admin Token（统一入口） */
export function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

/** 设置 / 清除 Admin Token */
export function setAdminToken(token: string) {
  if (token.trim()) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
