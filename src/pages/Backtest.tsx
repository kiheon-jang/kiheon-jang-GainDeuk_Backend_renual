import React from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import BacktestCard from '@/components/cards/BacktestCard';
import { media } from '@/utils/responsive';

const BacktestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  ${media.max.sm`
    gap: 1.5rem;
  `}
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
  
  ${media.max.sm`
    padding: 1.5rem 1rem;
  `}
`;

const HeroTitle = styled.h2`
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  margin: 0 0 1rem 0;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  
  ${media.max.sm`
    padding: 1rem;
  `}
`;

const InfoTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 1rem 0;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &::before {
    content: '📊';
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const Backtest: React.FC = () => {
  return (
    <MainLayout 
      title="백테스팅" 
      description="AI 매매 전략의 과거 성과를 분석하고 검증해보세요"
    >
      <BacktestContainer>
        <HeroSection>
          <HeroTitle>📈 AI 매매 전략 백테스팅</HeroTitle>
          <HeroDescription>
            과거 데이터를 기반으로 AI 매매 전략의 성과를 분석하고 검증해보세요
          </HeroDescription>
        </HeroSection>

        <ContentSection>
          <SectionTitle>🎯 백테스팅 실행</SectionTitle>
          <BacktestCard />
        </ContentSection>

        <InfoSection>
          <InfoTitle>📋 백테스팅 가이드</InfoTitle>
          <InfoList>
            <InfoItem>
              <strong>시작/종료 날짜:</strong> 분석하고 싶은 기간을 설정하세요
            </InfoItem>
            <InfoItem>
              <strong>초기 자본:</strong> 백테스팅에 사용할 가상 자본을 입력하세요
            </InfoItem>
            <InfoItem>
              <strong>분석 결과:</strong> 수익률, 승률, 최대 낙폭, 샤프 비율 등을 확인할 수 있습니다
            </InfoItem>
            <InfoItem>
              <strong>거래 내역:</strong> 실제 매매 신호에 따른 거래 결과를 상세히 볼 수 있습니다
            </InfoItem>
            <InfoItem>
              <strong>주의사항:</strong> 과거 성과가 미래 수익을 보장하지는 않습니다
            </InfoItem>
          </InfoList>
        </InfoSection>
      </BacktestContainer>
    </MainLayout>
  );
};

export default Backtest;
