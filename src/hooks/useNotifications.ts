import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import type { 
  NotificationSettings, 
  NotificationHistory, 
  NotificationData,
  NotificationAction 
} from '@/types/notifications';

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [history, setHistory] = useState<NotificationHistory>(notificationService.getHistory());
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  // 설정 업데이트
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    notificationService.updateSettings(newSettings);
    setSettings(notificationService.getSettings());
  }, []);

  // 알림 표시 함수들
  const showNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp'>) => {
    const id = notificationService.show(notification);
    setActiveNotifications(prev => [...prev, id]);
    return id;
  }, []);

  const showSuccess = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.success(title, message, options);
  }, []);

  const showError = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.error(title, message, options);
  }, []);

  const showWarning = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.warning(title, message, options);
  }, []);

  const showInfo = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.info(title, message, options);
  }, []);

  const showTradingSignal = useCallback((
    title: string, 
    message: string, 
    actions?: NotificationAction[], 
    options?: Partial<NotificationData>
  ) => {
    return notificationService.tradingSignal(title, message, actions, options);
  }, []);

  const showPriceAlert = useCallback((
    title: string, 
    message: string, 
    actions?: NotificationAction[], 
    options?: Partial<NotificationData>
  ) => {
    return notificationService.priceAlert(title, message, actions, options);
  }, []);

  const showNewsAlert = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.newsAlert(title, message, options);
  }, []);

  const showMarketUpdate = useCallback((title: string, message: string, options?: Partial<NotificationData>) => {
    return notificationService.marketUpdate(title, message, options);
  }, []);

  // 알림 관리 함수들
  const dismissNotification = useCallback((id: string) => {
    notificationService.dismiss(id);
    setActiveNotifications(prev => prev.filter(notificationId => notificationId !== id));
  }, []);

  const dismissAllNotifications = useCallback(() => {
    notificationService.dismissAll();
    setActiveNotifications([]);
  }, []);

  const clearHistory = useCallback(() => {
    notificationService.clearHistory();
    setHistory(notificationService.getHistory());
  }, []);

  // 알림 테스트 함수
  const testNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info' | 'trading_signal' | 'price_alert') => {
    const testMessages = {
      success: { title: '성공!', message: '작업이 성공적으로 완료되었습니다.' },
      error: { title: '오류 발생', message: '작업 중 오류가 발생했습니다.' },
      warning: { title: '주의', message: '주의가 필요한 상황입니다.' },
      info: { title: '정보', message: '유용한 정보를 확인하세요.' },
      trading_signal: { 
        title: '매매 신호', 
        message: 'BTC/USDT 매수 신호가 감지되었습니다.',
        actions: [
          { label: '상세보기', action: () => console.log('상세보기 클릭') },
          { label: '거래하기', action: () => console.log('거래하기 클릭') }
        ]
      } as any,
      price_alert: { 
        title: '가격 알림', 
        message: 'BTC가 $50,000을 돌파했습니다!',
        actions: [
          { label: '차트 보기', action: () => console.log('차트 보기 클릭') }
        ]
      } as any
    };

    const testData = testMessages[type];
    if (type === 'trading_signal') {
      return showTradingSignal(testData.title, testData.message, testData.actions);
    } else if (type === 'price_alert') {
      return showPriceAlert(testData.title, testData.message, testData.actions);
    } else {
      return showNotification({
        type,
        title: testData.title,
        message: testData.message,
        priority: 'medium'
      });
    }
  }, [showNotification, showTradingSignal, showPriceAlert]);

  // 주기적으로 활성 알림 목록 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotifications(notificationService.getActiveNotifications());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    // 상태
    settings,
    history,
    activeNotifications,
    
    // 설정 관리
    updateSettings,
    
    // 알림 표시
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showTradingSignal,
    showPriceAlert,
    showNewsAlert,
    showMarketUpdate,
    
    // 알림 관리
    dismissNotification,
    dismissAllNotifications,
    clearHistory,
    
    // 테스트
    testNotification,
  };
};
