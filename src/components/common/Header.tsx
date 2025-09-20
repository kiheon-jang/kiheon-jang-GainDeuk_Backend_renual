import React from 'react';
import styled from 'styled-components';
import { Home, User, Settings, Menu } from 'lucide-react';
import { ROUTES } from '@/constants';

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
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.MD}) {
    display: none;
  }
`;

const NavItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.gray[500]};
  background: ${({ theme, active }) => active ? theme.colors.gray[50] : 'transparent'};
  text-decoration: none;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};
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
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.MD}) {
    display: flex;
  }
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
