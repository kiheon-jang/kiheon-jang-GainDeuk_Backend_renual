import toast, { type Toast } from 'react-hot-toast';
import type { 
  NotificationData, 
  NotificationType, 
  NotificationSettings, 
  NotificationHistory,
  NotificationAction 
} from '@/types/notifications';
import { 
  DEFAULT_NOTIFICATION_SETTINGS, 
  NOTIFICATION_TYPE_CONFIG, 
  NOTIFICATION_KEYS 
} from '@/types/notifications';
import { storage } from '@/utils';

class NotificationService {
  private settings: NotificationSettings;
  private history: NotificationHistory;
  private activeNotifications: Map<string, Toast> = new Map();
  private soundEnabled: boolean = true;

  constructor() {
    this.settings = this.loadSettings();
    this.history = this.loadHistory();
    this.setupAudioContext();
  }

  private loadSettings(): NotificationSettings {
    try {
      const saved = storage.get(NOTIFICATION_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...saved } : DEFAULT_NOTIFICATION_SETTINGS;
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  private loadHistory(): NotificationHistory {
    try {
      const saved = storage.get(NOTIFICATION_KEYS.HISTORY);
      return saved ? { ...saved, notifications: (saved as any).notifications || [], maxHistorySize: (saved as any).maxHistorySize || 100 } : { notifications: [], maxHistorySize: 100 };
    } catch {
      return { notifications: [], maxHistorySize: 100 };
    }
  }

  private saveSettings(): void {
    try {
      storage.set(NOTIFICATION_KEYS.SETTINGS, this.settings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  }

  private saveHistory(): void {
    try {
      storage.set(NOTIFICATION_KEYS.HISTORY, this.history);
    } catch (error) {
      console.error('Failed to save notification history:', error);
    }
  }

  private setupAudioContext(): void {
    // Web Audio API를 사용한 사운드 재생 준비
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        // AudioContext는 사용자 인터랙션 후에만 생성 가능
        this.soundEnabled = true;
      }
    } catch (error) {
      console.warn('Audio context not available:', error);
      this.soundEnabled = false;
    }
  }

  private playSound(type: NotificationType): void {
    if (!this.settings.soundEnabled || !this.soundEnabled) return;

    try {
      const config = NOTIFICATION_TYPE_CONFIG[type];
      if (config.sound) {
        // 실제 프로덕션에서는 public/sounds/ 폴더에 사운드 파일들을 배치
        const audio = new Audio(`/sounds/${config.sound}`);
        audio.volume = 0.3; // 볼륨 조절
        audio.play().catch(() => {
          // 사운드 재생 실패 시 무시 (사용자가 차단했을 수 있음)
        });
      }
    } catch (error) {
      console.warn('Failed to play notification sound:', error);
    }
  }

  private vibrate(type: NotificationType): void {
    if (!this.settings.vibrationEnabled || !navigator.vibrate) return;

    try {
      const config = NOTIFICATION_TYPE_CONFIG[type];
      const pattern = (config as any).priority === 'high' || (config as any).priority === 'urgent' 
        ? [200, 100, 200] // 긴급한 알림은 더 강한 진동
        : [100]; // 일반 알림은 짧은 진동
      
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Failed to vibrate:', error);
    }
  }

  private addToHistory(notification: NotificationData): void {
    this.history.notifications.unshift(notification);
    
    // 히스토리 크기 제한
    if (this.history.notifications.length > this.history.maxHistorySize) {
      this.history.notifications = this.history.notifications.slice(0, this.history.maxHistorySize);
    }
    
    this.saveHistory();
  }

  private createToastContent(notification: NotificationData): string {
    const config = NOTIFICATION_TYPE_CONFIG[notification.type];
    
    // 간단한 텍스트 기반 알림으로 변경
    let content = `${config.icon} ${notification.title}`;
    if (notification.message) {
      content += `\n${notification.message}`;
    }
    if (notification.actions && notification.actions.length > 0) {
      content += `\n\n액션: ${notification.actions.map(a => a.label).join(', ')}`;
    }
    
    return content;
  }

  // 공개 메서드들
  public show(notification: Omit<NotificationData, 'id' | 'timestamp'>): string {
    if (!this.settings.enabled) return '';

    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: NotificationData = {
      ...notification,
      id,
      timestamp: Date.now(),
    };

    // 히스토리에 추가
    this.addToHistory(fullNotification);

    // 사운드 및 진동 재생
    this.playSound(notification.type);
    this.vibrate(notification.type);

    // 토스트 표시
    const config = NOTIFICATION_TYPE_CONFIG[notification.type];
    const duration = notification.duration ?? config.duration ?? this.settings.duration;

    const toastId = toast(
      this.createToastContent(fullNotification),
      {
        id,
        duration,
        position: this.settings.position,
        style: {
          background: '#FFFFFF',
          border: `2px solid ${config.color}`,
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          maxWidth: '420px',
        },
        iconTheme: {
          primary: config.color,
          secondary: '#FFFFFF',
        },
      }
    );

    this.activeNotifications.set(id, toastId as any);
    return id;
  }

  public success(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'success',
      title,
      message,
      priority: 'medium',
      ...options,
    });
  }

  public error(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'error',
      title,
      message,
      priority: 'high',
      ...options,
    });
  }

  public warning(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      priority: 'medium',
      ...options,
    });
  }

  public info(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'info',
      title,
      message,
      priority: 'low',
      ...options,
    });
  }

  public tradingSignal(title: string, message: string, actions?: NotificationAction[], options?: Partial<NotificationData>): string {
    return this.show({
      type: 'trading_signal',
      title,
      message,
      priority: 'high',
      actions,
      ...options,
    });
  }

  public priceAlert(title: string, message: string, actions?: NotificationAction[], options?: Partial<NotificationData>): string {
    return this.show({
      type: 'price_alert',
      title,
      message,
      priority: 'high',
      actions,
      ...options,
    });
  }

  public newsAlert(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'news_alert',
      title,
      message,
      priority: 'medium',
      ...options,
    });
  }

  public marketUpdate(title: string, message: string, options?: Partial<NotificationData>): string {
    return this.show({
      type: 'market_update',
      title,
      message,
      priority: 'low',
      ...options,
    });
  }

  public dismiss(id: string): void {
    toast.dismiss(id);
    this.activeNotifications.delete(id);
  }

  public dismissAll(): void {
    toast.dismiss();
    this.activeNotifications.clear();
  }

  public updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public getHistory(): NotificationHistory {
    return { ...this.history };
  }

  public clearHistory(): void {
    this.history.notifications = [];
    this.saveHistory();
  }

  public getActiveNotifications(): string[] {
    return Array.from(this.activeNotifications.keys());
  }
}

// 싱글톤 인스턴스
export const notificationService = new NotificationService();

// 편의 함수들
export const notify = {
  success: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.success(title, message, options),
  error: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.error(title, message, options),
  warning: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.warning(title, message, options),
  info: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.info(title, message, options),
  tradingSignal: (title: string, message: string, actions?: NotificationAction[], options?: Partial<NotificationData>) => 
    notificationService.tradingSignal(title, message, actions, options),
  priceAlert: (title: string, message: string, actions?: NotificationAction[], options?: Partial<NotificationData>) => 
    notificationService.priceAlert(title, message, actions, options),
  newsAlert: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.newsAlert(title, message, options),
  marketUpdate: (title: string, message: string, options?: Partial<NotificationData>) => 
    notificationService.marketUpdate(title, message, options),
};
