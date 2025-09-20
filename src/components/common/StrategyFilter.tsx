import React from 'react';
import styled from 'styled-components';

interface StrategyFilterProps {
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ isActive, theme }) => isActive ? theme.colors.primary : theme.colors.gray[200]};
  background: ${({ isActive, theme }) => isActive ? theme.colors.primary : theme.colors.background.primary};
  color: ${({ isActive, theme }) => isActive ? 'white' : theme.colors.gray[700]};

  &:hover {
    background: ${({ isActive, theme }) => isActive ? theme.colors.primary + 'dd' : theme.colors.gray[50]};
    border-color: ${({ isActive, theme }) => isActive ? theme.colors.primary + 'dd' : theme.colors.gray[300]};
  }
`;

const strategies = [
  { value: 'all', label: '전체' },
  { value: 'SCALPING', label: '스캘핑' },
  { value: 'DAY_TRADING', label: '데이트레이딩' },
  { value: 'SWING_TRADING', label: '스윙' },
  { value: 'LONG_TERM', label: '장기투자' },
];

const StrategyFilter: React.FC<StrategyFilterProps> = ({
  selectedStrategy,
  onStrategyChange
}) => {
  return (
    <FilterContainer>
      {strategies.map((strategy) => (
        <FilterButton
          key={strategy.value}
          isActive={selectedStrategy === strategy.value}
          onClick={() => onStrategyChange(strategy.value)}
        >
          {strategy.label}
        </FilterButton>
      ))}
    </FilterContainer>
  );
};

export default StrategyFilter;
