import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, type Theme } from '@/constants/theme';
import { THEME_MODES } from '@/constants';
import { storage } from '@/utils';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // 로컬 스토리지에서 테마 설정 확인
    const savedTheme = storage.get('theme');
    if (savedTheme) {
      return savedTheme === THEME_MODES.DARK;
    }
    
    // 시스템 테마 설정 확인
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false; // 기본값은 라이트 모드
  });

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (mode: 'light' | 'dark') => {
    setIsDarkMode(mode === THEME_MODES.DARK);
  };

  // 테마 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    storage.set('theme', isDarkMode ? THEME_MODES.DARK : THEME_MODES.LIGHT);
    
    // HTML 요소에 테마 클래스 추가/제거 (CSS 변수 사용을 위해)
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // 사용자가 수동으로 테마를 변경하지 않은 경우에만 시스템 테마를 따름
        const savedTheme = storage.get('theme');
        if (!savedTheme) {
          setIsDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
