import React, { useState } from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import InvestmentTestForm from '@/components/forms/InvestmentTestForm';
import InvestmentAnalysisResult from '@/components/cards/InvestmentAnalysisResult';
import { useInvestmentTest, useAnalyzeUserProfile, useSaveUserProfile } from '@/hooks/useApi';
import type { UserProfile } from '@/types';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const IntroSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
  margin-bottom: 2rem;
`;

const IntroTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const IntroDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const TestSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger}15;
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  text-align: center;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const ProfileAnalysis: React.FC = () => {
  const [, setTestAnswers] = useState<Record<number, number> | null>(null);
  const [analysisResult, setAnalysisResult] = useState<UserProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: testData, isLoading: testLoading, error: testError } = useInvestmentTest();
  const analyzeProfileMutation = useAnalyzeUserProfile();
  const saveProfileMutation = useSaveUserProfile();

  const handleTestSubmit = async (answers: Record<number, number>) => {
    setTestAnswers(answers);
    setIsAnalyzing(true);

    try {
      // Record를 배열로 변환
      const answersArray = Object.entries(answers).map(([questionId, answerIndex]) => ({
        questionId: parseInt(questionId),
        answerIndex
      }));
      
      const result = await analyzeProfileMutation.mutateAsync(answersArray);
      setAnalysisResult(result);
      
      // 결과를 사용자 프로필에 저장
      await saveProfileMutation.mutateAsync(result);
    } catch (error) {
      console.error('Profile analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetakeTest = () => {
    setTestAnswers(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  if (testLoading) {
    return (
      <MainLayout 
        title="👤 내 투자 성향 분석" 
        description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
      >
        <LoadingContainer>
          <LoadingSpinner size="lg" text="투자 성향 테스트를 불러오는 중..." />
        </LoadingContainer>
      </MainLayout>
    );
  }

  if (testError) {
    return (
      <MainLayout 
        title="👤 내 투자 성향 분석" 
        description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
      >
        <ErrorMessage>
          투자 성향 테스트를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      </MainLayout>
    );
  }

  if (isAnalyzing) {
    return (
      <MainLayout 
        title="👤 내 투자 성향 분석" 
        description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
      >
        <LoadingContainer>
          <LoadingSpinner size="lg" text="AI가 투자 성향을 분석하는 중..." />
        </LoadingContainer>
      </MainLayout>
    );
  }

  if (analysisResult) {
    return (
      <MainLayout 
        title="👤 내 투자 성향 분석" 
        description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
      >
        <ProfileContainer>
          <IntroSection>
            <IntroTitle>🎉 분석 완료!</IntroTitle>
            <IntroDescription>
              AI가 당신의 투자 성향을 분석했습니다.<br/>
              맞춤형 투자 전략을 확인해보세요.
            </IntroDescription>
          </IntroSection>

          <TestSection>
            <InvestmentAnalysisResult
              profile={analysisResult}
              onRetakeTest={handleRetakeTest}
            />
          </TestSection>
        </ProfileContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="👤 내 투자 성향 분석" 
      description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
    >
      <ProfileContainer>
        <IntroSection>
          <IntroTitle>🧠 투자 성향 테스트</IntroTitle>
          <IntroDescription>
            몇 가지 질문에 답해주시면 AI가 당신의 투자 성향을 분석하고<br/>
            맞춤형 투자 전략을 추천해드립니다.
          </IntroDescription>
        </IntroSection>

        <TestSection>
          {testData && (
            <InvestmentTestForm
              testData={testData}
              onSubmit={handleTestSubmit}
              onRetake={handleRetakeTest}
            />
          )}
        </TestSection>
      </ProfileContainer>
    </MainLayout>
  );
};

export default ProfileAnalysis;
