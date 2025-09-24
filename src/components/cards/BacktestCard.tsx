import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '@/services/api';
import type { BacktestResult } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const BacktestContainer = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
`;

const BacktestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BacktestTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const BacktestForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 24px;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const MetricValue = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme, positive, negative }) => {
    if (positive) return theme.colors.success;
    if (negative) return theme.colors.danger;
    return theme.colors.text.primary;
  }};
`;

const TradesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const TradeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TradeSymbol = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TradeType = styled.span<{ type: 'BUY' | 'SELL' }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme, type }) => 
    type === 'BUY' ? theme.colors.success : theme.colors.danger};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TradeAmount = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TradeProfit = styled.span<{ profit?: number }>`
  font-weight: 600;
  color: ${({ theme, profit }) => {
    if (!profit) return theme.colors.text.secondary;
    return profit > 0 ? theme.colors.success : theme.colors.danger;
  }};
`;

interface BacktestCardProps {
  className?: string;
  onRunBacktest?: () => void;
  isRunning?: boolean;
  result?: any;
}

const BacktestCard: React.FC<BacktestCardProps> = ({ 
  className, 
  onRunBacktest, 
  isRunning = false, 
  result 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [formData, setFormData] = useState({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    initialCapital: 10000
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'initialCapital' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await api.runBacktest(
        formData.startDate,
        formData.endDate,
        formData.initialCapital
      );
      setResults(result);
      toast.success('백테스팅이 완료되었습니다!');
    } catch (error) {
      console.error('Backtest failed:', error);
      toast.error('백테스팅 실행에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <BacktestContainer className={className}>
      <BacktestHeader>
        <BacktestTitle>백테스팅</BacktestTitle>
      </BacktestHeader>

      <BacktestForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="startDate">시작 날짜</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">종료 날짜</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="initialCapital">초기 자본</Label>
          <Input
            id="initialCapital"
            name="initialCapital"
            type="number"
            value={formData.initialCapital}
            onChange={handleInputChange}
            min="1000"
            step="1000"
            required
          />
        </FormGroup>

        <Button
          type="submit"
          disabled={isLoading || isRunning}
          style={{ height: 'fit-content' }}
          onClick={onRunBacktest ? (e: React.MouseEvent) => { e.preventDefault(); onRunBacktest(); } : undefined}
        >
          {isLoading || isRunning ? <LoadingSpinner size="sm" /> : '백테스팅 실행'}
        </Button>
      </BacktestForm>

      {(results || result) && (
        <ResultsContainer>
          <h4>백테스팅 결과</h4>
          
          <ResultsGrid>
            <MetricCard>
              <MetricLabel>총 거래 수</MetricLabel>
              <MetricValue>{(results || result)?.summary?.totalTrades || 0}</MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>초기 자본</MetricLabel>
              <MetricValue>{formatCurrency((results || result)?.summary?.initialCapital || 0)}</MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>최종 자본</MetricLabel>
              <MetricValue>{formatCurrency((results || result)?.summary?.finalCapital || 0)}</MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>총 수익률</MetricLabel>
              <MetricValue positive={(results || result)?.summary?.totalReturn > 0} negative={(results || result)?.summary?.totalReturn < 0}>
                {formatPercentage((results || result)?.summary?.totalReturn || 0)}
              </MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>승률</MetricLabel>
              <MetricValue>{formatPercentage((results || result)?.performance?.winRate || 0)}</MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>최대 낙폭</MetricLabel>
              <MetricValue negative>{formatPercentage((results || result)?.summary?.maxDrawdown || 0)}</MetricValue>
            </MetricCard>

            <MetricCard>
              <MetricLabel>샤프 비율</MetricLabel>
              <MetricValue>{((results || result)?.performance?.sharpeRatio || 0).toFixed(2)}</MetricValue>
            </MetricCard>
          </ResultsGrid>

          {(results || result)?.trades?.length > 0 && (
            <div>
              <h5>거래 내역</h5>
              <TradesList>
                {(results || result)?.trades?.map((trade: any, index: number) => (
                  <TradeItem key={index}>
                    <TradeInfo>
                      <TradeSymbol>{trade.symbol}</TradeSymbol>
                      <TradeType type={trade.type}>{trade.type}</TradeType>
                    </TradeInfo>
                    <div>
                      <TradeAmount>{formatCurrency(trade.amount)}</TradeAmount>
                      {trade.profit !== undefined && (
                        <TradeProfit profit={trade.profit}>
                          {trade.profit > 0 ? '+' : ''}{formatCurrency(trade.profit)}
                        </TradeProfit>
                      )}
                    </div>
                  </TradeItem>
                ))}
              </TradesList>
            </div>
          )}
        </ResultsContainer>
      )}
    </BacktestContainer>
  );
};

export default BacktestCard;
