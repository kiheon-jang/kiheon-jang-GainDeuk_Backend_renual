import React from 'react';
import styled from 'styled-components';
import { Home, TrendingUp, User, Coins, Settings } from 'lucide-react';
import { ROUTES } from '@/constants';
import { media, touchFriendly } from '@/utils/responsive';

interface MobileNavigationProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: none;
  
  ${media.max.lg`
    display: flex;
  `}
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  min-height: 60px;
  padding: 0.5rem 0;
`;

const NavItem = styled.li<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  margin: 0 0.25rem;
  padding: 0.5rem;
  
  ${({ $isActive, theme }) => $isActive && `
    background: ${theme.colors.primary}15;
    color: ${theme.colors.primary};
  `}
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const NavIcon = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.FAST};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavLabel = styled.span<{ $isActive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.text.secondary};
  transition: ${({ theme }) => theme.transitions.FAST};
  text-align: center;
  line-height: 1;
`;

const NavItemComponent: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  path, 
  isActive, 
  onClick 
}) => {
  return (
    <NavItem 
      $isActive={isActive}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${label} 페이지로 이동`}
    >
      <NavIcon $isActive={isActive}>
        {icon}
      </NavIcon>
      <NavLabel $isActive={isActive}>
        {label}
      </NavLabel>
    </NavItem>
  );
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  currentPath = '/',
  onNavigate 
}) => {
  const navigationItems = [
    {
      icon: <Home size={20} />,
      label: '대시보드',
      path: ROUTES.DASHBOARD,
    },
    {
      icon: <TrendingUp size={20} />,
      label: '매매가이드',
      path: ROUTES.TRADING,
    },
    {
      icon: <User size={20} />,
      label: '내성향',
      path: ROUTES.PROFILE,
    },
    {
      icon: <Coins size={20} />,
      label: '코인목록',
      path: ROUTES.COINS,
    },
    {
      icon: <Settings size={20} />,
      label: '설정',
      path: ROUTES.SETTINGS,
    },
  ];

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // 기본 네비게이션 (브라우저 히스토리 사용)
      window.location.href = path;
    }
  };

  return (
    <NavigationContainer role="navigation" aria-label="모바일 네비게이션">
      <NavList>
        {navigationItems.map((item) => (
          <NavItemComponent
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={currentPath === item.path}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </NavList>
    </NavigationContainer>
  );
};

export default MobileNavigation;
