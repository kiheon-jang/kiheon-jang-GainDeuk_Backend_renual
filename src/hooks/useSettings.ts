import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { UserSettings, NotificationSettings, LanguageSettings, ThemeSettings, PrivacySettings, AppSettings } from '@/types/settings';
import { DEFAULT_SETTINGS, SETTINGS_KEYS } from '@/types/settings';
import { storage } from '@/utils';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // 설정 로드
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = storage.get(SETTINGS_KEYS.USER_SETTINGS);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('설정을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 설정 저장
  const saveSettings = useCallback((newSettings: UserSettings) => {
    try {
      storage.set(SETTINGS_KEYS.USER_SETTINGS, newSettings);
      setSettings(newSettings);
      toast.success('설정이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('설정 저장 중 오류가 발생했습니다.');
    }
  }, []);

  // 개별 설정 업데이트
  const updateNotificationSettings = useCallback((notifications: Partial<NotificationSettings>) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...notifications }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateLanguageSettings = useCallback((language: Partial<LanguageSettings>) => {
    const newSettings = {
      ...settings,
      language: { ...settings.language, ...language }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateThemeSettings = useCallback((theme: Partial<ThemeSettings>) => {
    const newSettings = {
      ...settings,
      theme: { ...settings.theme, ...theme }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updatePrivacySettings = useCallback((privacy: Partial<PrivacySettings>) => {
    const newSettings = {
      ...settings,
      privacy: { ...settings.privacy, ...privacy }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateAppSettings = useCallback((app: Partial<AppSettings>) => {
    const newSettings = {
      ...settings,
      app: { ...settings.app, ...app }
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  // 설정 초기화
  const resetSettings = useCallback(() => {
    try {
      storage.remove(SETTINGS_KEYS.USER_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
      toast.success('설정이 초기화되었습니다.');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      toast.error('설정 초기화 중 오류가 발생했습니다.');
    }
  }, []);

  // 설정 내보내기
  const exportSettings = useCallback(() => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'gaindeuk-settings.json';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('설정이 내보내기되었습니다.');
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast.error('설정 내보내기 중 오류가 발생했습니다.');
    }
  }, [settings]);

  // 설정 가져오기
  const importSettings = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        if (importedSettings && typeof importedSettings === 'object') {
          saveSettings({ ...DEFAULT_SETTINGS, ...importedSettings });
          toast.success('설정이 가져오기되었습니다.');
        } else {
          throw new Error('Invalid settings format');
        }
      } catch (error) {
        console.error('Failed to import settings:', error);
        toast.error('설정 파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
  }, [saveSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    updateNotificationSettings,
    updateLanguageSettings,
    updateThemeSettings,
    updatePrivacySettings,
    updateAppSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };
};
