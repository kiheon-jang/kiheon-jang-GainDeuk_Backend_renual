import React, { useState } from 'react';
import styled from 'styled-components';
import { notify } from '@/services/notificationService';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CoinRecommendationCard from '@/components/cards/CoinRecommendationCard';
import UserProfileSummary from '@/components/cards/UserProfileSummary';
import MarketSummary from '@/components/cards/MarketSummary';
import { useDashboardData } from '@/hooks/useApi';
import type { CoinRecommendation } from '@/types';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const WelcomeDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  margin: 0;
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size['2XL']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger}15;
  color: ${({ theme }) => theme.colors.danger};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  text-align: center;
  font-weight: 500;
`;

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  const handleAddToWatchlist = (coinId: string) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(coinId)) {
        newWatchlist.delete(coinId);
        notify.success('관심목록 업데이트', '관심목록에서 제거되었습니다.');
      } else {
        newWatchlist.add(coinId);
        notify.success('관심목록 업데이트', '관심목록에 추가되었습니다.');
      }
      return newWatchlist;
    });
  };

  const handleShare = (recommendation: CoinRecommendation) => {
    const shareText = `AI가 추천하는 코인: ${recommendation.coin.name} (${recommendation.coin.symbol})\n예상 수익률: ${recommendation.expectedReturn}%\n위험도: ${recommendation.riskLevel}/5\n\nGainDeuk에서 확인해보세요!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AI 코인 추천',
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // 공유 실패 시 클립보드에 복사
        navigator.clipboard.writeText(shareText);
        notify.success('공유 완료', '추천 정보가 클립보드에 복사되었습니다.');
      });
    } else {
      // Web Share API를 지원하지 않는 경우 클립보드에 복사
      navigator.clipboard.writeText(shareText);
      notify.success('공유 완료', '추천 정보가 클립보드에 복사되었습니다.');
    }
  };

  const handleCoinClick = (recommendation: CoinRecommendation) => {
    // TODO: 코인 상세 페이지로 이동 또는 모달 표시
    console.log('Coin clicked:', recommendation.coin.id);
    notify.info('코인 상세보기', `${recommendation.coin.name} 상세 정보를 확인합니다.`);
  };

  if (isLoading) {
    return (
      <MainLayout 
        title="대시보드" 
        description="AI가 추천하는 오늘의 코인을 확인해보세요"
      >
        <LoadingSpinner size="lg" text="대시보드 데이터를 불러오는 중..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout 
        title="대시보드" 
        description="AI가 추천하는 오늘의 코인을 확인해보세요"
      >
        <ErrorMessage>
          데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="대시보드" 
      description="AI가 추천하는 오늘의 코인을 확인해보세요"
    >
      <DashboardContainer>
        <WelcomeSection>
          <WelcomeTitle>🤖 AI가 추천하는 오늘의 코인</WelcomeTitle>
          <WelcomeDescription>
            복잡한 분석은 AI가 처리하고, 당신은 신호만 따라하세요!
          </WelcomeDescription>
        </WelcomeSection>

        {/* AI 추천 코인 섹션 */}
        {dashboardData?.aiRecommendations && dashboardData.aiRecommendations.length > 0 && (
          <>
            <SectionTitle>📊 AI 추천 코인</SectionTitle>
            <RecommendationsGrid>
              {dashboardData.aiRecommendations.map((recommendation, index) => (
                <CoinRecommendationCard
                  key={`${recommendation.coin.id}-${index}`}
                  recommendation={recommendation}
                  onClick={() => handleCoinClick(recommendation)}
                  onAddToWatchlist={handleAddToWatchlist}
                  onShare={handleShare}
                  isInWatchlist={watchlist.has(recommendation.coin.id)}
                />
              ))}
            </RecommendationsGrid>
          </>
        )}

        {/* 하단 정보 섹션 */}
        <ContentGrid>
          {/* 사용자 프로필 요약 */}
          {dashboardData?.userProfile && (
            <UserProfileSummary
              profile={dashboardData.userProfile}
              onEditClick={() => {
                // TODO: 프로필 수정 페이지로 이동
                console.log('Edit profile clicked');
              }}
            />
          )}

          {/* 시장 현황 */}
          {dashboardData?.marketSummary && (
            <MarketSummary
              totalMarketCap={dashboardData.marketSummary.totalMarketCap}
              marketTrend={dashboardData.marketSummary.marketTrend}
              trendDescription={dashboardData.marketSummary.trendDescription}
            />
          )}
        </ContentGrid>
      </DashboardContainer>
    </MainLayout>
  );
};

export default Dashboard;
