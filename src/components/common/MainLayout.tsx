import React from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import PageContainer from './PageContainer';
import MobileNavigation from './MobileNavigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { media, responsiveSpacing } from '@/utils/responsive';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
  transition: ${({ theme }) => theme.transitions.NORMAL};
`;

const MainContent = styled.main`
  flex: 1;
  padding-bottom: 60px; // 모바일 네비게이션을 위한 여백
  
  ${media.min.lg`
    padding-bottom: 0; // 데스크톱에서는 여백 제거
  `}
`;

const ThemeToggleContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  
  ${media.max.sm`
    top: 0.75rem;
    right: 0.75rem;
  `}
`;

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showPageHeader?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title, 
  description, 
  showHeader = true,
  showPageHeader = true,
  currentPath,
  onNavigate
}) => {
  return (
    <LayoutContainer>
      {showHeader && <Header />}
      <MainContent>
        <PageContainer 
          title={title} 
          description={description} 
          showHeader={showPageHeader}
        >
          {children}
        </PageContainer>
      </MainContent>
      
      {/* 모바일 네비게이션 */}
      <MobileNavigation 
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
      
      {/* 테마 토글 버튼 */}
      <ThemeToggleContainer>
        <ThemeToggle />
      </ThemeToggleContainer>
      
      {/* 토스트 알림 설정 */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </LayoutContainer>
  );
};

export default MainLayout;
