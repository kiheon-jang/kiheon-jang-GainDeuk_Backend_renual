/**
 * 성능 설정 컴포넌트
 * 성능 모니터링, 캐싱, 서비스 워커 관련 설정을 관리합니다.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Activity, 
  Database, 
  Wifi, 
  WifiOff, 
  Trash2, 
  RefreshCw, 
  Bell,
  BellOff,
  Settings as SettingsIcon,
  Monitor,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { 
  getServiceWorkerStatus, 
  getCacheSize, 
  clearCache, 
  isOffline,
  addNetworkStatusListener,
  requestNotificationPermission,
  sendNotification
} from '@/utils/serviceWorker';
import { useSettings } from '@/hooks/useSettings';

const SettingsContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const SettingsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SettingsSection = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.MD};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SettingValue = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
`;

const StatusIndicator = styled.div<{ $status: 'online' | 'offline' | 'enabled' | 'disabled' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.fonts.size.XS};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'online':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'offline':
        return `
          background: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
        `;
      case 'enabled':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'disabled':
        return `
          background: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[600]};
        `;
      default:
        return '';
    }
  }}
`;

const ActionButton = styled(Button)`
  min-width: auto;
  padding: 0.5rem 1rem;
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.background.primary};
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.white : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.FAST};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : theme.colors.primary}20;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const PerformanceSettings: React.FC = () => {
  const { settings, updateAppSettings } = useSettings();
  
  const [swStatus, setSwStatus] = useState<{
    isSupported: boolean;
    isRegistered: boolean;
    isControlling: boolean;
  }>({
    isSupported: false,
    isRegistered: false,
    isControlling: false
  });
  
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 서비스 워커 상태 확인
  useEffect(() => {
    const checkSWStatus = async () => {
      const status = await getServiceWorkerStatus();
      setSwStatus(status);
    };
    
    checkSWStatus();
  }, []);

  // 캐시 크기 확인
  useEffect(() => {
    const checkCacheSize = async () => {
      const size = await getCacheSize();
      setCacheSize(size);
    };
    
    checkCacheSize();
  }, []);

  // 네트워크 상태 확인
  useEffect(() => {
    setNetworkStatus(isOffline() ? 'offline' : 'online');
    
    const cleanup = addNetworkStatusListener(
      () => setNetworkStatus('online'),
      () => setNetworkStatus('offline')
    );
    
    return cleanup;
  }, []);

  // 알림 권한 확인
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // 캐시 클리어
  const handleClearCache = async () => {
    if (confirm('모든 캐시를 삭제하시겠습니까?')) {
      await clearCache();
      setCacheSize(0);
      alert('캐시가 삭제되었습니다.');
    }
  };

  // 알림 권한 요청
  const handleRequestNotificationPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      sendNotification('알림이 활성화되었습니다!', {
        body: '이제 중요한 업데이트를 받을 수 있습니다.'
      });
    }
  };

  // 테스트 알림 전송
  const handleSendTestNotification = () => {
    sendNotification('테스트 알림', {
      body: '성능 설정이 정상적으로 작동하고 있습니다.'
    });
  };

  // 성능 모니터링 토글
  const handleTogglePerformanceMonitoring = () => {
    updateAppSettings({
      performanceMonitoring: !settings.app.performanceMonitoring
    });
  };

  // 캐시 크기 포맷팅
  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsIcon size={20} />
        <SettingsTitle>성능 설정</SettingsTitle>
      </SettingsHeader>

      {/* 성능 모니터링 설정 */}
      <SettingsSection>
        <SectionTitle>
          <Monitor size={16} />
          성능 모니터링
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <Monitor size={14} />
            실시간 성능 모니터
          </SettingLabel>
          <ToggleButton 
            $isActive={settings.app.performanceMonitoring}
            onClick={handleTogglePerformanceMonitoring}
          >
            {settings.app.performanceMonitoring ? (
              <>
                <ToggleRight size={16} />
                활성화됨
              </>
            ) : (
              <>
                <ToggleLeft size={16} />
                비활성화됨
              </>
            )}
          </ToggleButton>
        </SettingItem>
      </SettingsSection>

      {/* 서비스 워커 상태 */}
      <SettingsSection>
        <SectionTitle>
          <Database size={16} />
          서비스 워커
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <Database size={14} />
            지원 여부
          </SettingLabel>
          <StatusIndicator $status={swStatus.isSupported ? 'enabled' : 'disabled'}>
            {swStatus.isSupported ? '지원됨' : '지원 안됨'}
          </StatusIndicator>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <Database size={14} />
            등록 상태
          </SettingLabel>
          <StatusIndicator $status={swStatus.isRegistered ? 'enabled' : 'disabled'}>
            {swStatus.isRegistered ? '등록됨' : '등록 안됨'}
          </StatusIndicator>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <Database size={14} />
            제어 상태
          </SettingLabel>
          <StatusIndicator $status={swStatus.isControlling ? 'enabled' : 'disabled'}>
            {swStatus.isControlling ? '제어 중' : '제어 안됨'}
          </StatusIndicator>
        </SettingItem>
      </SettingsSection>

      {/* 캐시 관리 */}
      <SettingsSection>
        <SectionTitle>
          <Activity size={16} />
          캐시 관리
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <Activity size={14} />
            캐시 크기
          </SettingLabel>
          <SettingValue>{formatCacheSize(cacheSize)}</SettingValue>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <Trash2 size={14} />
            캐시 관리
          </SettingLabel>
          <ActionButton 
            variant="outline" 
            size="sm"
            onClick={handleClearCache}
            disabled={cacheSize === 0}
          >
            <Trash2 size={14} />
            캐시 삭제
          </ActionButton>
        </SettingItem>
      </SettingsSection>

      {/* 네트워크 상태 */}
      <SettingsSection>
        <SectionTitle>
          <Wifi size={16} />
          네트워크 상태
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            {networkStatus === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}
            연결 상태
          </SettingLabel>
          <StatusIndicator $status={networkStatus}>
            {networkStatus === 'online' ? '온라인' : '오프라인'}
          </StatusIndicator>
        </SettingItem>
      </SettingsSection>

      {/* 알림 설정 */}
      <SettingsSection>
        <SectionTitle>
          <Bell size={16} />
          알림 설정
        </SectionTitle>
        
        <SettingItem>
          <SettingLabel>
            <Bell size={14} />
            권한 상태
          </SettingLabel>
          <StatusIndicator $status={notificationPermission === 'granted' ? 'enabled' : 'disabled'}>
            {notificationPermission === 'granted' ? '허용됨' : 
             notificationPermission === 'denied' ? '거부됨' : '요청 필요'}
          </StatusIndicator>
        </SettingItem>
        
        <SettingItem>
          <SettingLabel>
            <Bell size={14} />
            알림 관리
          </SettingLabel>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {notificationPermission !== 'granted' && (
              <ActionButton 
                variant="outline" 
                size="sm"
                onClick={handleRequestNotificationPermission}
              >
                <Bell size={14} />
                권한 요청
              </ActionButton>
            )}
            
            {notificationPermission === 'granted' && (
              <ActionButton 
                variant="outline" 
                size="sm"
                onClick={handleSendTestNotification}
              >
                <Bell size={14} />
                테스트
              </ActionButton>
            )}
          </div>
        </SettingItem>
      </SettingsSection>
    </SettingsContainer>
  );
};

export default PerformanceSettings;
