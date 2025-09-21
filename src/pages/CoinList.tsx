import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CoinSearchAndFilter from '@/components/common/CoinSearchAndFilter';
import CoinCard from '@/components/cards/CoinCard';
import CoinDetailModal from '@/components/modals/CoinDetailModal';
import { useCoins, useRecommendations } from '@/hooks/useApi';
import type { Coin } from '@/types';

const CoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.MD}) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
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

const StatsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  box-shadow: ${({ theme }) => theme.shadows.SM};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  margin-bottom: 1rem;
`;

const StatsText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const CoinList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 코인 목록 조회
  const { 
    data: coins = [], 
    isLoading: coinsLoading, 
    error: coinsError 
  } = useCoins(searchQuery, sortBy, sortOrder, filterBy);

  // AI 추천 코인 조회 (AI 추천 표시용)
  const { data: recommendations = [] } = useRecommendations();

  // AI 추천 코인 ID 목록
  const recommendedCoinIds = useMemo(() => 
    recommendations.map(rec => rec.coinId), 
    [recommendations]
  );

  // 필터링된 코인 목록
  const filteredCoins = useMemo(() => {
    let filtered = [...coins];

    // 필터 적용
    switch (filterBy) {
      case 'top100':
        filtered = filtered.slice(0, 100);
        break;
      case 'gainers':
        filtered = filtered.filter(coin => coin.change24h > 0);
        break;
      case 'losers':
        filtered = filtered.filter(coin => coin.change24h < 0);
        break;
      case 'high-volume':
        filtered = filtered.filter(coin => coin.volume && coin.volume > 1000000000);
        break;
    }

    return filtered;
  }, [coins, filterBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleFilter = (filter: string) => {
    setFilterBy(filter);
  };

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  if (coinsError) {
    return (
      <MainLayout 
        title="🪙 코인 목록" 
        description="전체 코인을 검색하고 상세 정보를 확인해보세요"
      >
        <ErrorMessage>
          코인 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </ErrorMessage>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="🪙 코인 목록" 
      description="전체 코인을 검색하고 상세 정보를 확인해보세요"
    >
      <CoinContainer>
        <CoinSearchAndFilter
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={handleFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          filterBy={filterBy}
        />

        <StatsSection>
          <StatsText>
            총 {filteredCoins.length}개의 코인
            {searchQuery && ` (검색: "${searchQuery}")`}
          </StatsText>
          <StatsText>
            {recommendedCoinIds.length}개 AI 추천 코인
          </StatsText>
        </StatsSection>

        {coinsLoading ? (
          <LoadingSpinner size="lg" text="코인 목록을 불러오는 중..." />
        ) : filteredCoins.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
            <EmptyDescription>
              다른 검색어를 시도하거나 필터를 조정해보세요.
            </EmptyDescription>
          </EmptyState>
        ) : (
          <CoinGrid>
            {filteredCoins.map((coin, index) => (
              <CoinCard
                key={coin.id || `coin-${index}`}
                coin={coin}
                isRecommended={recommendedCoinIds.includes(coin.id)}
                onClick={() => handleCoinClick(coin)}
              />
            ))}
          </CoinGrid>
        )}

        <CoinDetailModal
          coin={selectedCoin}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </CoinContainer>
    </MainLayout>
  );
};

export default CoinList;
