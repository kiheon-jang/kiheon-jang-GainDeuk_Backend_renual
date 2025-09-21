import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface CoinSearchAndFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onFilter: (filter: string) => void;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterBy: string;
}

const SearchFilterContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  transition: ${({ theme }) => theme.transitions.FAST};
  background: ${({ theme }) => theme.colors.background.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }
`;

const SortButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.background.primary};
  color: ${({ theme, $isActive }) => 
    $isActive ? 'white' : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : theme.colors.primary}15;
  }
`;

const CoinSearchAndFilter: React.FC<CoinSearchAndFilterProps> = ({
  onSearch,
  onSort,
  onFilter,
  searchQuery,
  sortBy,
  sortOrder,
  filterBy,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearch(value);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      // 같은 정렬 기준이면 순서만 변경
      onSort(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 새로운 정렬 기준이면 기본적으로 오름차순
      onSort(newSortBy, 'asc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilter(e.target.value);
  };

  return (
    <SearchFilterContainer>
      <SearchSection>
        <SearchInputContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="🔍 비트코인, 이더리움, BTC 검색..."
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
        </SearchInputContainer>
      </SearchSection>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>
            <Filter size={16} />
            필터:
          </FilterLabel>
          <Select value={filterBy} onChange={handleFilterChange}>
            <option value="all">전체</option>
            <option value="top100">상위 100개</option>
            <option value="gainers">상승 코인</option>
            <option value="losers">하락 코인</option>
            <option value="high-volume">고거래량</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>정렬:</FilterLabel>
          <SortButton
            $isActive={sortBy === 'marketCap'}
            onClick={() => handleSortChange('marketCap')}
          >
            시가총액
            {sortBy === 'marketCap' && (
              sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </SortButton>
          
          <SortButton
            $isActive={sortBy === 'price'}
            onClick={() => handleSortChange('price')}
          >
            가격
            {sortBy === 'price' && (
              sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </SortButton>
          
          <SortButton
            $isActive={sortBy === 'change24h'}
            onClick={() => handleSortChange('change24h')}
          >
            24h 변동
            {sortBy === 'change24h' && (
              sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </SortButton>
          
          <SortButton
            $isActive={sortBy === 'volume'}
            onClick={() => handleSortChange('volume')}
          >
            거래량
            {sortBy === 'volume' && (
              sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
            )}
          </SortButton>
        </FilterGroup>
      </FilterSection>
    </SearchFilterContainer>
  );
};

export default CoinSearchAndFilter;
