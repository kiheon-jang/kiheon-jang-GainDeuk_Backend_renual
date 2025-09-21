// 설정 관련 타입 정의

export interface NotificationSettings {
  tradingSignals: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
  marketUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface LanguageSettings {
  language: 'ko' | 'en';
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
  timeFormat: '24h' | '12h';
  currency: 'KRW' | 'USD' | 'EUR';
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReporting: boolean;
  personalizedAds: boolean;
}

export interface AppSettings {
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  showAdvancedFeatures: boolean;
  debugMode: boolean;
  performanceMonitoring: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  language: LanguageSettings;
  theme: ThemeSettings;
  privacy: PrivacySettings;
  app: AppSettings;
}

// 기본 설정값
export const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    tradingSignals: true,
    priceAlerts: true,
    newsAlerts: false,
    marketUpdates: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  language: {
    language: 'ko',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    currency: 'KRW',
  },
  theme: {
    mode: 'auto',
    primaryColor: '#3B82F6',
    fontSize: 'medium',
    reducedMotion: false,
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
  },
  app: {
    autoRefresh: true,
    refreshInterval: 30,
    showAdvancedFeatures: false,
    debugMode: false,
    performanceMonitoring: false,
  },
};

// 설정 키 상수
export const SETTINGS_KEYS = {
  USER_SETTINGS: 'gaindeuk_user_settings',
  THEME_MODE: 'gaindeuk_theme_mode',
  LANGUAGE: 'gaindeuk_language',
  NOTIFICATIONS: 'gaindeuk_notifications',
} as const;
