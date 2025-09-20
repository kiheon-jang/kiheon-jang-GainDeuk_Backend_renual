import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InputWrapper = styled.div<{ hasError?: boolean; isFocused?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.danger : theme.colors.border.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: ${({ theme }) => theme.transitions.FAST};
  overflow: hidden;

  &:focus-within {
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.danger : theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? `${theme.colors.danger}20` : `${theme.colors.primary}20`};
  }

  ${({ isFocused }) => isFocused && css`
    border-color: ${({ theme }) => theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  `}
`;

const InputField = styled.input<{ 
  hasLeftIcon?: boolean; 
  hasRightIcon?: boolean; 
  size?: 'sm' | 'md' | 'lg';
}>`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.family.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.FAST};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Size variants */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: ${({ theme }) => theme.fonts.size.SM};
        `;
      case 'lg':
        return css`
          padding: 0.875rem 1rem;
          font-size: ${({ theme }) => theme.fonts.size.LG};
        `;
      default: // md
        return css`
          padding: 0.625rem 0.75rem;
          font-size: ${({ theme }) => theme.fonts.size.BASE};
        `;
    }
  }}

  /* Icon spacing */
  ${({ hasLeftIcon, size = 'md' }) => hasLeftIcon && css`
    padding-left: ${size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem'};
  `}

  ${({ hasRightIcon, size = 'md' }) => hasRightIcon && css`
    padding-right: ${size === 'sm' ? '2rem' : size === 'lg' ? '3rem' : '2.5rem'};
  `}
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.gray[100]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: ${({ theme }) => theme.fonts.size.XS};
  color: ${({ theme, isError }) => 
    isError ? theme.colors.danger : theme.colors.text.tertiary};
  line-height: 1.4;
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const displayHelperText = error || helperText;

  const handlePasswordToggle = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      
      <InputWrapper hasError={hasError} isFocused={isFocused}>
        {leftIcon && (
          <IconWrapper position="left">
            {leftIcon}
          </IconWrapper>
        )}
        
        <InputField
          ref={ref}
          type={inputType}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon || isPassword}
          size={size}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {isPassword ? (
          <PasswordToggle
            type="button"
            onClick={handlePasswordToggle}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </PasswordToggle>
        ) : rightIcon && (
          <IconWrapper position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputWrapper>
      
      {displayHelperText && (
        <HelperText isError={hasError}>
          {displayHelperText}
        </HelperText>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
