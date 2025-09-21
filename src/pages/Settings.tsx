import React from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NotificationSettingsComponent from '@/components/settings/NotificationSettings';
import LanguageSettingsComponent from '@/components/settings/LanguageSettings';
import ThemeSettingsComponent from '@/components/settings/ThemeSettings';
import AppSettingsComponent from '@/components/settings/AppSettings';
import SettingsManagement from '@/components/settings/SettingsManagement';
import PerformanceSettings from '@/components/settings/PerformanceSettings';
import CachingSettings from '@/components/settings/CachingSettings';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationHistory from '@/components/notifications/NotificationHistory';
import { useSettings } from '@/hooks/useSettings';
import { useNotifications } from '@/hooks/useNotifications';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Settings: React.FC = () => {
  const {
    settings,
    isLoading,
    updateNotificationSettings,
    updateLanguageSettings,
    updateThemeSettings,
    updateAppSettings,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings();

  const {
    settings: notificationSettings,
    history: notificationHistory,
    updateSettings: updateNotificationSettingsHook,
    testNotification,
    clearHistory,
  } = useNotifications();

  if (isLoading) {
    return (
      <MainLayout 
        title="⚙️ 설정" 
        description="알림, 언어, 테마 등 앱 설정을 관리하세요"
      >
        <LoadingContainer>
          <LoadingSpinner size="lg" text="설정을 불러오는 중..." />
        </LoadingContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="⚙️ 설정" 
      description="알림, 언어, 테마 등 앱 설정을 관리하세요"
    >
      <SettingsContainer>
        <NotificationSettingsComponent
          settings={settings.notifications}
          onUpdate={updateNotificationSettings}
        />

        <NotificationSettings
          settings={notificationSettings}
          onUpdate={updateNotificationSettingsHook}
          onTestNotification={testNotification}
        />

        <NotificationHistory
          notifications={notificationHistory.notifications}
          onClearHistory={clearHistory}
        />

        <LanguageSettingsComponent
          settings={settings.language}
          onUpdate={updateLanguageSettings}
        />

        <ThemeSettingsComponent
          settings={settings.theme}
          onUpdate={updateThemeSettings}
        />

        <AppSettingsComponent
          settings={settings.app}
          onUpdate={updateAppSettings}
        />

        <PerformanceSettings />

        <CachingSettings />

        <SettingsManagement
          onReset={resetSettings}
          onExport={exportSettings}
          onImport={importSettings}
        />
      </SettingsContainer>
    </MainLayout>
  );
};

export default Settings;
