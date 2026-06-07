/**
 * Application Type Definitions
 * アプリケーション全体で使用される型定義をここに配置します
 */

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};
