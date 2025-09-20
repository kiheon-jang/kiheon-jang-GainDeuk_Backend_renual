import React from 'react';
import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';
import { touchFriendlyButton, disableHoverOnTouch, touchFocus } from '@/utils/touch';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-family: ${({ theme }) => theme.fonts.family.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  
  /* 터치 친화적 스타일 적용 */
  ${touchFriendlyButton}
  ${disableHoverOnTouch}
  ${touchFocus}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  /* Size variants */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: ${({ theme }) => theme.fonts.size.SM};
          min-height: 2rem;
        `;
      case 'lg':
        return css`
          padding: 0.875rem 1.5rem;
          font-size: ${({ theme }) => theme.fonts.size.LG};
          min-height: 3rem;
        `;
      default: // md
        return css`
          padding: 0.625rem 1rem;
          font-size: ${({ theme }) => theme.fonts.size.BASE};
          min-height: 2.5rem;
        `;
    }
  }}

  /* Color variants */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${({ theme }) => theme.colors.gray[100]};
          color: ${({ theme }) => theme.colors.text.primary};
          border: 1px solid ${({ theme }) => theme.colors.border.primary};

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[200]};
            border-color: ${({ theme }) => theme.colors.border.secondary};
          }

          &:active:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[300]};
          }
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${({ theme }) => theme.colors.primary};
          border: 1px solid ${({ theme }) => theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.primary}15;
            border-color: ${({ theme }) => theme.colors.primary};
          }

          &:active:not(:disabled) {
            background: ${({ theme }) => theme.colors.primary}25;
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${({ theme }) => theme.colors.text.secondary};
          border: 1px solid transparent;

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[100]};
            color: ${({ theme }) => theme.colors.text.primary};
          }

          &:active:not(:disabled) {
            background: ${({ theme }) => theme.colors.gray[200]};
          }
        `;
      
      case 'danger':
        return css`
          background: ${({ theme }) => theme.colors.danger};
          color: white;
          border: 1px solid ${({ theme }) => theme.colors.danger};

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.danger}dd;
            border-color: ${({ theme }) => theme.colors.danger}dd;
          }

          &:active:not(:disabled) {
            background: ${({ theme }) => theme.colors.danger}cc;
          }
        `;
      
      default: // primary
        return css`
          background: ${({ theme }) => theme.colors.primary};
          color: white;
          border: 1px solid ${({ theme }) => theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${({ theme }) => theme.colors.primary}dd;
            border-color: ${({ theme }) => theme.colors.primary}dd;
          }

          &:active:not(:disabled) {
            background: ${({ theme }) => theme.colors.primary}cc;
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  fullWidth = false,
  ...props
}) => {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={16} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </ButtonBase>
  );
};

export default Button;
