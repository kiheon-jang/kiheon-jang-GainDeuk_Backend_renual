import React from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AnalysisCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const AnalysisTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0 0 1rem 0;
`;

const AnalysisText = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
  margin: 0;
`;

const ProfileAnalysis: React.FC = () => {
  return (
    <MainLayout 
      title="👤 내 투자 성향 분석" 
      description="AI가 분석한 당신의 투자 성향과 맞춤 추천을 확인해보세요"
    >
      <ProfileContainer>
        <AnalysisCard>
          <AnalysisTitle>🧠 AI가 분석한 내 투자 성향</AnalysisTitle>
          <AnalysisText>
            🛡️ 안정형 투자자 (65%)<br/>
            <br/>
            • 위험을 피하고 안정적인 수익 선호<br/>
            • 장기 투자보다는 단기 수익 관심<br/>
            • 큰 변동성보다는 꾸준한 상승 선호<br/>
            <br/>
            🎯 추천 전략:<br/>
            • 비트코인, 이더리움 중심<br/>
            • 1-3개월 보유 추천<br/>
            • 하루 1-2회 체크
          </AnalysisText>
        </AnalysisCard>

        <AnalysisCard>
          <AnalysisTitle>📝 성향 테스트 다시하기</AnalysisTitle>
          <AnalysisText>
            투자 성향이 바뀌었다면 다시 테스트해보세요.
          </AnalysisText>
        </AnalysisCard>

        <AnalysisCard>
          <AnalysisTitle>⚙️ 맞춤 설정 변경하기</AnalysisTitle>
          <AnalysisText>
            투자 성향과 선호도를 세부적으로 조정할 수 있습니다.
          </AnalysisText>
        </AnalysisCard>
      </ProfileContainer>
    </MainLayout>
  );
};

export default ProfileAnalysis;
