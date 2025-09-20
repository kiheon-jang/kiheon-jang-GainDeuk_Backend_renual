import React from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';

const CoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchSection = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const CoinCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
`;

const CoinIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: bold;
`;

const CoinName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.5rem 0;
`;

const CoinPrice = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

const CoinList: React.FC = () => {
  return (
    <MainLayout 
      title="🪙 코인 목록" 
      description="전체 코인을 검색하고 상세 정보를 확인해보세요"
    >
      <CoinContainer>
        <SearchSection>
          <SearchInput 
            type="text" 
            placeholder="🔍 비트코인, 이더리움 검색..." 
          />
        </SearchSection>

        <CoinGrid>
          <CoinCard>
            <CoinIcon>₿</CoinIcon>
            <CoinName>비트코인</CoinName>
            <CoinPrice>₩45,000,000 (+2.5%)</CoinPrice>
          </CoinCard>

          <CoinCard>
            <CoinIcon>Ξ</CoinIcon>
            <CoinName>이더리움</CoinName>
            <CoinPrice>₩3,200,000 (-1.2%)</CoinPrice>
          </CoinCard>

          <CoinCard>
            <CoinIcon>🟡</CoinIcon>
            <CoinName>바이낸스</CoinName>
            <CoinPrice>₩420,000 (+5.8%)</CoinPrice>
          </CoinCard>

          <CoinCard>
            <CoinIcon>🔴</CoinIcon>
            <CoinName>리플</CoinName>
            <CoinPrice>₩1,200 (+3.2%)</CoinPrice>
          </CoinCard>

          <CoinCard>
            <CoinIcon>🟢</CoinIcon>
            <CoinName>도지코인</CoinName>
            <CoinPrice>₩0.15 (+8.7%)</CoinPrice>
          </CoinCard>

          <CoinCard>
            <CoinIcon>🔵</CoinIcon>
            <CoinName>카르다노</CoinName>
            <CoinPrice>₩1,800 (-2.1%)</CoinPrice>
          </CoinCard>
        </CoinGrid>
      </CoinContainer>
    </MainLayout>
  );
};

export default CoinList;
