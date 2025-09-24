import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { notify } from '@/services/notificationService';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RealTimeIndicator from '@/components/common/RealTimeIndicator';
import SignalDataCard from '@/components/cards/SignalDataCard';
import MarketSentimentCard from '@/components/cards/MarketSentimentCard';
import TechnicalAnalysisCard from '@/components/cards/TechnicalAnalysisCard';
import WhaleActivityCard from '@/components/cards/WhaleActivityCard';
import { useRealTimeData, useNetworkStatus } from '@/hooks/useRealTimeData';
import { media, responsiveTypography, responsiveSpacing } from '@/utils/responsive';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// 스타일드 컴포넌트
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
  
  ${media.max.sm`
    gap: 1.5rem;
  `}
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
  
  ${media.max.sm`
    padding: 1.5rem 1rem;
  `}
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeaderTitle = styled.h1`
  ${responsiveTypography.h1}
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderDescription = styled.p`
  ${responsiveTypography.body}
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  
  ${media.max.sm`
    grid-template-columns: 1fr;
    gap: 0.75rem;
  `}
`;

const StatusItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const StatusLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StatusValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatusIcon = styled.span<{ $isActive?: boolean }>`
  animation: ${({ $isActive }) => $isActive ? pulse : 'none'} 2s ease-in-out infinite;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  
  ${media.max.lg`
    grid-template-columns: 1fr;
    gap: 1.5rem;
  `}
  
  ${media.max.sm`
    gap: 1rem;
  `}
`;

const FullWidthCard = styled.div`
  grid-column: 1 / -1;
  animation: ${slideIn} 0.8s ease-out;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.danger}15;
  color: ${({ theme }) => theme.colors.danger};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  text-align: center;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.danger}30;
  
  ${media.max.sm`
    padding: 1.5rem;
  `}
`;

const RefreshButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// 타입 정의
interface SignalDashboardData {
  priceData: {
    current: number;
    change1h: number;
    change24h: number;
    change7d: number;
    change30d: number;
  };
  volumeData: {
    ratio: number;
    change24h: number;
    average: number;
  };
  marketData: {
    dominance: number;
    phase: string;
    totalMarketCap: number;
  };
  sentimentData: {
    fearGreedIndex: number;
    sentiment: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
    newsSentiment: number;
    socialSentiment: number;
  };
  whaleData: {
    activityScore: number;
    largeTransactions: number;
    totalVolume: string;
    averageTransactionSize: string;
  };
  technicalData: {
    volatility: number;
    rsi: number;
    macd: number;
    bollinger: number;
  };
  lastUpdated: string;
}

const SignalDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<SignalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 실시간 데이터 및 네트워크 상태 훅
  const { startDashboardUpdates, stopRealTimeUpdates } = useRealTimeData();
  const { isOnline, connectionType } = useNetworkStatus();

  // 데이터 로드 함수
  const loadDashboardData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // 실제 API 호출 대신 모의 데이터 생성
      // 실제 구현에서는 백엔드 API를 호출하여 시그널 계산에 사용되는 데이터들을 가져옴
      const mockData: SignalDashboardData = {
        priceData: {
          current: 43250.50,
          change1h: 1.25,
          change24h: -2.15,
          change7d: 8.75,
          change30d: 15.30
        },
        volumeData: {
          ratio: 2.3,
          change24h: 45.2,
          average: 1.8
        },
        marketData: {
          dominance: 42.5,
          phase: 'ALTCOIN_SEASON',
          totalMarketCap: 1650000000000
        },
        sentimentData: {
          fearGreedIndex: 65,
          sentiment: 'greed',
          newsSentiment: 72,
          socialSentiment: 68
        },
        whaleData: {
          activityScore: 75,
          largeTransactions: 12,
          totalVolume: '$2.4B',
          averageTransactionSize: '$200K'
        },
        technicalData: {
          volatility: 18.5,
          rsi: 58,
          macd: 0.15,
          bollinger: 0.85
        },
        lastUpdated: new Date().toISOString()
      };
      
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(mockData);
      setLastUpdateTime(new Date());
      notify.success('데이터 업데이트', '시그널 데이터가 성공적으로 업데이트되었습니다.');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
      setError(errorMessage);
      notify.error('데이터 로드 실패', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 실시간 업데이트 시작
  useEffect(() => {
    if (isOnline && dashboardData) {
      startDashboardUpdates(
        'signal-dashboard',
        (newData) => {
          console.log('New signal data received:', newData);
          setLastUpdateTime(new Date());
        }
      );
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [isOnline, dashboardData, startDashboardUpdates, stopRealTimeUpdates]);

  // 자동 새로고침 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && !isRefreshing) {
        loadDashboardData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline, isRefreshing]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <MainLayout 
        title="시그널 데이터 대시보드" 
        description="실시간 시그널 계산 데이터를 확인하세요"
      >
        <LoadingSpinner size="lg" text="시그널 데이터를 불러오는 중..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout 
        title="시그널 데이터 대시보드" 
        description="실시간 시그널 계산 데이터를 확인하세요"
      >
        <ErrorMessage>
          <h3>데이터 로드 실패</h3>
          <p>{error}</p>
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? '새로고침 중...' : '다시 시도'}
          </RefreshButton>
        </ErrorMessage>
      </MainLayout>
    );
  }

  if (!dashboardData) {
    return (
      <MainLayout 
        title="시그널 데이터 대시보드" 
        description="실시간 시그널 계산 데이터를 확인하세요"
      >
        <ErrorMessage>
          <h3>데이터 없음</h3>
          <p>시그널 데이터를 찾을 수 없습니다.</p>
          <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? '새로고침 중...' : '데이터 로드'}
          </RefreshButton>
        </ErrorMessage>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="시그널 데이터 대시보드" 
      description="실시간 시그널 계산 데이터를 확인하세요"
    >
      <DashboardContainer>
        <RealTimeIndicator
          isOnline={isOnline}
          isRefreshing={isRefreshing}
          lastUpdateTime={lastUpdateTime}
          connectionType={connectionType}
        />
        
        <HeaderSection>
          <HeaderContent>
            <HeaderTitle>📊 실시간 시그널 데이터</HeaderTitle>
            <HeaderDescription>
              AI가 시그널을 계산하는 데 사용하는 모든 데이터를 실시간으로 모니터링하세요.
              가격, 거래량, 시장 심리, 고래 활동 등 다양한 지표를 한눈에 확인할 수 있습니다.
            </HeaderDescription>
            
            <StatusGrid>
              <StatusItem>
                <StatusLabel>시장 상태</StatusLabel>
                <StatusValue>
                  <StatusIcon $isActive={true}>📈</StatusIcon>
                  {dashboardData.marketData.phase}
                </StatusValue>
              </StatusItem>
              
              <StatusItem>
                <StatusLabel>공포탐욕지수</StatusLabel>
                <StatusValue>
                  <StatusIcon $isActive={true}>😊</StatusIcon>
                  {dashboardData.sentimentData.fearGreedIndex}
                </StatusValue>
              </StatusItem>
              
              <StatusItem>
                <StatusLabel>고래 활동</StatusLabel>
                <StatusValue>
                  <StatusIcon $isActive={dashboardData.whaleData.activityScore > 60}>🐋</StatusIcon>
                  {dashboardData.whaleData.activityScore}/100
                </StatusValue>
              </StatusItem>
              
              <StatusItem>
                <StatusLabel>거래량 비율</StatusLabel>
                <StatusValue>
                  <StatusIcon $isActive={dashboardData.volumeData.ratio > 2}>📊</StatusIcon>
                  {dashboardData.volumeData.ratio.toFixed(1)}x
                </StatusValue>
              </StatusItem>
            </StatusGrid>
          </HeaderContent>
        </HeaderSection>

        <ContentGrid>
          {/* 기술적 분석 카드 */}
          <TechnicalAnalysisCard
            symbol="BTC"
            name="Bitcoin"
            priceData={dashboardData.priceData}
            volumeRatio={dashboardData.volumeData.ratio}
            volatility={dashboardData.technicalData.volatility}
            technicalIndicators={[
              { name: 'RSI', value: dashboardData.technicalData.rsi, status: 'moderate' },
              { name: 'MACD', value: dashboardData.technicalData.macd.toFixed(3), status: 'strong' },
              { name: '볼린저', value: dashboardData.technicalData.bollinger.toFixed(2), status: 'moderate' }
            ]}
            lastUpdated={dashboardData.lastUpdated}
          />

          {/* 시장 심리 분석 카드 */}
          <MarketSentimentCard
            fearGreedIndex={dashboardData.sentimentData.fearGreedIndex}
            sentiment={dashboardData.sentimentData.sentiment}
            btcDominance={dashboardData.marketData.dominance}
            marketPhase={dashboardData.marketData.phase}
            newsItems={[
              {
                id: '1',
                title: '비트코인 ETF 승인 기대감 확산',
                sentiment: 'positive',
                source: 'CoinDesk',
                publishedAt: new Date().toISOString()
              },
              {
                id: '2',
                title: '연준 금리 인상 가능성 언급',
                sentiment: 'negative',
                source: 'Reuters',
                publishedAt: new Date().toISOString()
              },
              {
                id: '3',
                title: '기관 투자자 암호화폐 관심 증가',
                sentiment: 'positive',
                source: 'Bloomberg',
                publishedAt: new Date().toISOString()
              }
            ]}
            lastUpdated={dashboardData.lastUpdated}
          />

          {/* 고래 활동 카드 */}
          <WhaleActivityCard
            activityScore={dashboardData.whaleData.activityScore}
            largeTransactions={dashboardData.whaleData.largeTransactions}
            totalVolume={dashboardData.whaleData.totalVolume}
            averageTransactionSize={dashboardData.whaleData.averageTransactionSize}
            recentTransactions={[
              {
                id: '1',
                type: 'buy',
                amount: '$1.2M',
                timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
              },
              {
                id: '2',
                type: 'sell',
                amount: '$850K',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
              },
              {
                id: '3',
                type: 'buy',
                amount: '$2.1M',
                timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
              }
            ]}
            lastUpdated={dashboardData.lastUpdated}
          />

          {/* 가격 데이터 카드 */}
          <SignalDataCard
            title="가격 모멘텀"
            icon="💰"
            data={[
              { label: '현재가', value: `$${dashboardData.priceData.current.toLocaleString()}`, color: '#3b82f6' },
              { label: '1시간', value: `${dashboardData.priceData.change1h > 0 ? '+' : ''}${dashboardData.priceData.change1h.toFixed(2)}%`, isPositive: dashboardData.priceData.change1h > 0 },
              { label: '24시간', value: `${dashboardData.priceData.change24h > 0 ? '+' : ''}${dashboardData.priceData.change24h.toFixed(2)}%`, isPositive: dashboardData.priceData.change24h > 0 },
              { label: '7일', value: `${dashboardData.priceData.change7d > 0 ? '+' : ''}${dashboardData.priceData.change7d.toFixed(2)}%`, isPositive: dashboardData.priceData.change7d > 0 },
              { label: '30일', value: `${dashboardData.priceData.change30d > 0 ? '+' : ''}${dashboardData.priceData.change30d.toFixed(2)}%`, isPositive: dashboardData.priceData.change30d > 0 }
            ]}
            isLive={true}
            lastUpdated={dashboardData.lastUpdated}
          />

          {/* 거래량 데이터 카드 */}
          <SignalDataCard
            title="거래량 분석"
            icon="📊"
            data={[
              { label: '거래량 비율', value: `${dashboardData.volumeData.ratio.toFixed(1)}x`, color: '#10b981', status: dashboardData.volumeData.ratio > 2 ? 'good' : 'warning' },
              { label: '24h 변화', value: `+${dashboardData.volumeData.change24h.toFixed(1)}%`, isPositive: true },
              { label: '평균 비율', value: `${dashboardData.volumeData.average.toFixed(1)}x`, color: '#6b7280' }
            ]}
            isLive={true}
            lastUpdated={dashboardData.lastUpdated}
          />

          {/* 시장 데이터 카드 */}
          <SignalDataCard
            title="시장 지표"
            icon="🌍"
            data={[
              { label: 'BTC 지배율', value: `${dashboardData.marketData.dominance.toFixed(1)}%`, color: '#f7931a' },
              { label: '시장 단계', value: dashboardData.marketData.phase, color: '#8b5cf6' },
              { label: '총 시가총액', value: `$${(dashboardData.marketData.totalMarketCap / 1000000000000).toFixed(1)}T`, color: '#3b82f6' }
            ]}
            isLive={true}
            lastUpdated={dashboardData.lastUpdated}
          />
        </ContentGrid>
      </DashboardContainer>
    </MainLayout>
  );
};

export default SignalDashboard;
