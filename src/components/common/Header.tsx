import React from 'react';
import styled from 'styled-components';
import { Home, User, Settings, Menu } from 'lucide-react';
import { ROUTES } from '@/constants';
import { media, responsiveTypography, touchFriendly } from '@/utils/responsive';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  position: sticky;
  top: 0;
  z-index: 100;
  
  ${media.max.sm`
    padding: 0.75rem 1rem;
  `}
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${responsiveTypography.h2}
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
  gap: 1rem;

  ${media.max.md`
    display: none;
  `}
`;

const NavItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.secondary};
  background: ${({ theme, active }) => active ? theme.colors.gray[50] : 'transparent'};
  text-decoration: none;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray[50]};
  }
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
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>G</LogoIcon>
        GainDeuk
      </Logo>
      
      <Navigation>
        <NavItem href={ROUTES.DASHBOARD}>
          <Home size={18} />
          대시보드
        </NavItem>
        <NavItem href={ROUTES.TRADING}>
          <User size={18} />
          매매 가이드
        </NavItem>
        <NavItem href={ROUTES.PROFILE}>
          <User size={18} />
          내 성향
        </NavItem>
        <NavItem href={ROUTES.COINS}>
          <User size={18} />
          코인 목록
        </NavItem>
        <NavItem href={ROUTES.SETTINGS}>
          <Settings size={18} />
          설정
        </NavItem>
      </Navigation>

      {showMenuButton && (
        <MobileMenuButton onClick={onMenuClick}>
          <Menu size={20} />
        </MobileMenuButton>
      )}
    </HeaderContainer>
  );
};

export default Header;
