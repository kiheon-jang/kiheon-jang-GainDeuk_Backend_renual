import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  fullWidth?: boolean;
}

const CardBase = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  background: ${({ theme }) => theme.colors.background.primary};
  transition: ${({ theme }) => theme.transitions.FAST};
  position: relative;
  overflow: hidden;

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  ${({ clickable }) => clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  /* Variant styles */
  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'elevated':
        return css`
          box-shadow: ${({ theme }) => theme.shadows.LG};
          border: 1px solid ${({ theme }) => theme.colors.border.primary};
        `;
      
      case 'outlined':
        return css`
          border: 1px solid ${({ theme }) => theme.colors.border.primary};
          box-shadow: none;
        `;
      
      case 'filled':
        return css`
          background: ${({ theme }) => theme.colors.background.secondary};
          border: 1px solid ${({ theme }) => theme.colors.border.primary};
          box-shadow: none;
        `;
      
      default: // default
        return css`
          box-shadow: ${({ theme }) => theme.shadows.MD};
          border: 1px solid ${({ theme }) => theme.colors.border.primary};
        `;
    }
  }}

  /* Padding variants */
  ${({ padding = 'md' }) => {
    switch (padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'sm':
        return css`
          padding: 1rem;
        `;
      case 'lg':
        return css`
          padding: 2rem;
        `;
      default: // md
        return css`
          padding: 1.5rem;
        `;
    }
  }}

  /* Hover effect */
  ${({ hover, variant = 'default' }) => hover && css`
    &:hover {
      box-shadow: ${variant === 'elevated' 
        ? ({ theme }) => theme.shadows.XL 
        : ({ theme }) => theme.shadows.LG};
      transform: translateY(-1px);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
`;

const CardFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  fullWidth = false,
  ...props
}) => {
  return (
    <CardBase
      variant={variant}
      padding={padding}
      hover={hover}
      clickable={clickable}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </CardBase>
  );
};

// Card sub-components
const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <CardHeader {...props}>{children}</CardHeader>
);

const Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
  <CardTitle {...props}>{children}</CardTitle>
);

const Subtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => (
  <CardSubtitle {...props}>{children}</CardSubtitle>
);

const Content: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <CardContent {...props}>{children}</CardContent>
);

const Footer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <CardFooter {...props}>{children}</CardFooter>
);

// Compound component pattern
const CardWithSubComponents = Card as typeof Card & {
  Header: typeof Header;
  Title: typeof Title;
  Subtitle: typeof Subtitle;
  Content: typeof Content;
  Footer: typeof Footer;
};

CardWithSubComponents.Header = Header;
CardWithSubComponents.Title = Title;
CardWithSubComponents.Subtitle = Subtitle;
CardWithSubComponents.Content = Content;
CardWithSubComponents.Footer = Footer;

export default CardWithSubComponents;
