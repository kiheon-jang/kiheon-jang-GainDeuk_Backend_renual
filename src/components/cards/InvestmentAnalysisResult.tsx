import React from 'react';
import styled from 'styled-components';
import { TrendingUp, Shield, Target, BarChart3, RefreshCw } from 'lucide-react';
import type { UserProfile } from '@/types';

interface InvestmentAnalysisResultProps {
  profile: UserProfile;
  onRetakeTest?: () => void;
}

const ResultContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.LG};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ResultIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ResultTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.5rem 0;
`;

const ResultSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const AnalysisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const AnalysisCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CardIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ color }) => `${color}15`};
  color: ${({ color }) => color};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const CardContent = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
`;

const RiskToleranceBar = styled.div`
  width: 100%;
  height: 1rem;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  overflow: hidden;
  margin: 1rem 0;
`;

const RiskToleranceFill = styled.div<{ level: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.secondary} 0%,
    ${({ theme }) => theme.colors.warning} 50%,
    ${({ theme }) => theme.colors.danger} 100%
  );
  width: ${({ level }) => level * 10}%;
  transition: width 0.3s ease;
`;

const StrategySection = styled.div`
  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const StrategyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StrategyText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  border: none;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: white;
        &:hover {
          background: ${theme.colors.primary}dd;
        }
      `;
    }
    return `
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[700]};
      &:hover {
        background: ${theme.colors.gray[200]};
      }
    `;
  }}
`;

const getInvestmentStyleInfo = (style: string) => {
  switch (style) {
    case 'conservative':
      return {
        icon: '🛡️',
        title: '안정형 투자자',
        description: '안전한 투자를 선호하며, 원금 보전을 최우선으로 생각합니다.',
        color: '#10B981'
      };
    case 'moderate':
      return {
        icon: '⚖️',
        title: '균형형 투자자',
        description: '안정성과 수익성의 균형을 추구하는 투자자입니다.',
        color: '#3B82F6'
      };
    case 'aggressive':
      return {
        icon: '🚀',
        title: '공격형 투자자',
        description: '높은 수익을 추구하며, 위험을 감수할 수 있는 투자자입니다.',
        color: '#EF4444'
      };
    default:
      return {
        icon: '📊',
        title: '투자자',
        description: '개인화된 투자 전략을 추천받으세요.',
        color: '#6B7280'
      };
  }
};

const getExperienceLevelInfo = (level: string) => {
  switch (level) {
    case 'beginner':
      return {
        icon: '🌱',
        title: '초심자',
        description: '암호화폐 투자를 시작하는 단계입니다.'
      };
    case 'intermediate':
      return {
        icon: '📈',
        title: '중급자',
        description: '기본적인 투자 지식을 가지고 있습니다.'
      };
    case 'advanced':
      return {
        icon: '🎯',
        title: '고급자',
        description: '풍부한 투자 경험과 전문 지식을 보유하고 있습니다.'
      };
    default:
      return {
        icon: '👤',
        title: '투자자',
        description: '개인화된 투자 경험 수준입니다.'
      };
  }
};

const InvestmentAnalysisResult: React.FC<InvestmentAnalysisResultProps> = ({
  profile,
  onRetakeTest
}) => {
  const styleInfo = getInvestmentStyleInfo(profile.investmentStyle);
  const experienceInfo = getExperienceLevelInfo(profile.experienceLevel);

  return (
    <ResultContainer>
      <ResultHeader>
        <ResultIcon>{styleInfo.icon}</ResultIcon>
        <ResultTitle>{styleInfo.title}</ResultTitle>
        <ResultSubtitle>{styleInfo.description}</ResultSubtitle>
      </ResultHeader>

      <AnalysisGrid>
        <AnalysisCard>
          <CardHeader>
            <CardIcon color={styleInfo.color}>
              <Shield size={20} />
            </CardIcon>
            <CardTitle>투자 성향</CardTitle>
          </CardHeader>
          <CardContent>
            <strong>{styleInfo.title}</strong><br/>
            {styleInfo.description}
          </CardContent>
        </AnalysisCard>

        <AnalysisCard>
          <CardHeader>
            <CardIcon color="#3B82F6">
              <BarChart3 size={20} />
            </CardIcon>
            <CardTitle>경험 수준</CardTitle>
          </CardHeader>
          <CardContent>
            <strong>{experienceInfo.title}</strong><br/>
            {experienceInfo.description}
          </CardContent>
        </AnalysisCard>

        <AnalysisCard>
          <CardHeader>
            <CardIcon color="#F59E0B">
              <Target size={20} />
            </CardIcon>
            <CardTitle>위험 감수도</CardTitle>
          </CardHeader>
          <CardContent>
            <strong>{profile.riskTolerance}/10</strong>
            <RiskToleranceBar>
              <RiskToleranceFill level={profile.riskTolerance} />
            </RiskToleranceBar>
            {profile.riskTolerance <= 3 && '낮음 (안전 우선)'}
            {profile.riskTolerance > 3 && profile.riskTolerance <= 7 && '보통 (균형 추구)'}
            {profile.riskTolerance > 7 && '높음 (수익 우선)'}
          </CardContent>
        </AnalysisCard>
      </AnalysisGrid>

      <StrategySection>
        <StrategyTitle>
          <TrendingUp size={20} />
          AI 추천 전략
        </StrategyTitle>
        <StrategyText>
          {profile.recommendedStrategy}
        </StrategyText>
      </StrategySection>

      <ActionButtons>
        <ActionButton variant="secondary" onClick={onRetakeTest}>
          <RefreshCw size={16} />
          다시 테스트하기
        </ActionButton>
        <ActionButton variant="primary" onClick={() => {
          // TODO: 대시보드로 이동
          console.log('Go to dashboard');
        }}>
          대시보드로 이동
        </ActionButton>
      </ActionButtons>
    </ResultContainer>
  );
};

export default InvestmentAnalysisResult;
