import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Home, TrendingUp, Settings, Menu, BarChart3 } from 'lucide-react';
import { ROUTES } from '@/constants';
import { media, responsiveTypography, touchFriendly } from '@/utils/responsive';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  position: sticky;
  top: 0;
  z-index: 100;
  
  ${media.max.sm`
    padding: 0.75rem 1rem;
    gap: 1rem;
  `}
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${responsiveTypography('lg', 'bold')}
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  
  ${media.max.sm`
    gap: 0.25rem;
  `}
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  
  ${media.max.sm`
    width: 1.75rem;
    height: 1.75rem;
  `}
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 600px;

  ${media.max.md`
    display: none;
  `}
`;

const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  transform: translateY(0);

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: ${({ $active }) => $active ? '80%' : '0%'};
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: translateX(-50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 1px;
    opacity: ${({ $active }) => $active ? '1' : '0'};
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }

  ${media.max.lg`
    padding: 0.6rem 0.8rem;
    font-size: 0.875rem;
  `}
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  ${touchFriendly}
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${media.max.md`
    display: flex;
  `}
`;

const Header: React.FC<HeaderProps> = ({ onMenuClick, showMenuButton = true }) => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === '/' || location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname === path;
  };

  const navigationItems = [
    { path: ROUTES.DASHBOARD, icon: <Home size={18} />, label: '대시보드' },
    { path: ROUTES.TRADING, icon: <TrendingUp size={18} />, label: '매매 가이드' },
    { path: ROUTES.BACKTEST, icon: <BarChart3 size={18} />, label: '백테스팅' },
    { path: ROUTES.SETTINGS, icon: <Settings size={18} />, label: '설정' },
  ];

  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>G</LogoIcon>
        GainDeuk
      </Logo>
      
      <Navigation>
        {navigationItems.map((item) => (
          <NavItem 
            key={item.path}
            href={item.path}
            $active={isActiveRoute(item.path)}
          >
            {item.icon}
            {item.label}
          </NavItem>
        ))}
      </Navigation>

      <RightSection>
        {showMenuButton && (
          <MobileMenuButton onClick={onMenuClick}>
            <Menu size={20} />
          </MobileMenuButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
