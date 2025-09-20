// 알림 시스템 관련 타입 정의

export type NotificationType = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'trading_signal' 
  | 'price_alert' 
  | 'news_alert' 
  | 'market_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: number;
  duration?: number; // milliseconds, undefined means default
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  desktopNotifications: boolean;
  duration: number; // default duration in milliseconds
  maxVisible: number; // maximum number of visible notifications
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export interface NotificationHistory {
  notifications: NotificationData[];
  maxHistorySize: number;
}

// 기본 알림 설정
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  desktopNotifications: false,
  duration: 5000, // 5 seconds
  maxVisible: 5,
  position: 'top-right',
};

// 알림 타입별 기본 설정
export const NOTIFICATION_TYPE_CONFIG = {
  success: {
    icon: '✅',
    color: '#10B981',
    sound: 'success.mp3',
    duration: 3000,
  },
  error: {
    icon: '❌',
    color: '#EF4444',
    sound: 'error.mp3',
    duration: 7000,
  },
  warning: {
    icon: '⚠️',
    color: '#F59E0B',
    sound: 'warning.mp3',
    duration: 5000,
  },
  info: {
    icon: 'ℹ️',
    color: '#3B82F6',
    sound: 'info.mp3',
    duration: 4000,
  },
  trading_signal: {
    icon: '📈',
    color: '#8B5CF6',
    sound: 'trading_signal.mp3',
    duration: 8000,
    priority: 'high' as NotificationPriority,
  },
  price_alert: {
    icon: '💰',
    color: '#EC4899',
    sound: 'price_alert.mp3',
    duration: 6000,
    priority: 'high' as NotificationPriority,
  },
  news_alert: {
    icon: '📰',
    color: '#06B6D4',
    sound: 'news_alert.mp3',
    duration: 5000,
  },
  market_update: {
    icon: '📊',
    color: '#84CC16',
    sound: 'market_update.mp3',
    duration: 4000,
  },
} as const;

// 알림 키 상수
export const NOTIFICATION_KEYS = {
  SETTINGS: 'gaindeuk_notification_settings',
  HISTORY: 'gaindeuk_notification_history',
} as const;
