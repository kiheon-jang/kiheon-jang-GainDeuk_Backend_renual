import React from 'react';
import styled from 'styled-components';
import { media, responsiveTypography, responsiveSpacing } from '@/utils/responsive';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 80px); // 헤더 높이만큼 빼기

  ${media.max.md`
    padding: 1.5rem 1rem;
  `}

  ${media.max.sm`
    padding: 1rem 0.75rem;
  `}
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  ${media.max.sm`
    margin-bottom: 1.5rem;
  `}
`;

const PageTitle = styled.h1`
  ${responsiveTypography.h1}
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  ${responsiveTypography.body}
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title, 
  description, 
  showHeader = true 
}) => {
  return (
    <Container>
      {showHeader && (title || description) && (
        <PageHeader>
          {title && <PageTitle>{title}</PageTitle>}
          {description && <PageDescription>{description}</PageDescription>}
        </PageHeader>
      )}
      {children}
    </Container>
  );
};

export default PageContainer;
