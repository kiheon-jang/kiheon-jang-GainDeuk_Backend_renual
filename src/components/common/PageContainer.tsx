import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: calc(100vh - 80px); // 헤더 높이만큼 빼기

  @media (max-width: ${({ theme }) => theme.breakpoints.MD}) {
    padding: 1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.SM}) {
    padding: 0.75rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  color: ${({ theme }) => theme.colors.gray[500]};
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
