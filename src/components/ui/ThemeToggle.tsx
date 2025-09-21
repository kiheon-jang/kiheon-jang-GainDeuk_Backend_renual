import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.FAST};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transform: ${({ $isVisible }) => $isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(180deg)'};
`;

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <IconWrapper $isVisible={!isDarkMode}>
        <Sun size={18} />
      </IconWrapper>
      <IconWrapper $isVisible={isDarkMode}>
        <Moon size={18} />
      </IconWrapper>
    </ToggleButton>
  );
};

export default ThemeToggle;
