import React from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import PageContainer from './PageContainer';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const MainContent = styled.main`
  flex: 1;
`;

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showPageHeader?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title, 
  description, 
  showHeader = true,
  showPageHeader = true 
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
