import React from 'react';
import styled from 'styled-components';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import type { TradingSignal } from '@/types';
import { formatPrice, getSignalColor, getSignalText } from '@/utils';

interface TradeExecutionModalProps {
  isOpen: boolean;
  signal: TradingSignal | null;
  onClose: () => void;
  onConfirm: (signalId: string, action: 'BUY' | 'SELL', amount: number, price: number) => void;
  isExecuting?: boolean;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.XL};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

const SignalSummary = styled.div<{ signalType: 'BUY' | 'SELL' | 'HOLD' }>`
  background: ${({ signalType, theme }) => signalType === 'HOLD' ? theme.colors.gray[50] : `${getSignalColor(signalType)}15`};
  border: 1px solid ${({ signalType, theme }) => signalType === 'HOLD' ? theme.colors.gray[200] : `${getSignalColor(signalType)}40`};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SignalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CoinImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 0.25rem 0;
`;

const CoinPrice = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SignalBadge = styled.div<{ signalType: 'BUY' | 'SELL' | 'HOLD' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ signalType }) => signalType === 'HOLD' ? '#F59E0B15' : `${getSignalColor(signalType)}15`};
  color: ${({ signalType }) => signalType === 'HOLD' ? '#F59E0B' : getSignalColor(signalType)};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fonts.size.SM};
`;

const TradeDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const DetailLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.XS};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: 600;
`;

const WarningSection = styled.div`
  background: ${({ theme }) => theme.colors.warning}15;
  border: 1px solid ${({ theme }) => theme.colors.warning}40;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const WarningTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.warning};
  margin-bottom: 0.5rem;
`;

const WarningText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary'; signalType?: 'BUY' | 'SELL' | 'HOLD'; disabled?: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.FAST};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;

  ${({ variant, signalType, disabled, theme }) => {
    if (variant === 'primary') {
      if (disabled) {
        return `
          background: #9CA3AF;
          color: white;
        `;
      }
      if (signalType === 'HOLD') {
        return `
          background: ${theme.colors.warning};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.warning}dd;
          }
        `;
      }
      return `
        background: ${signalType ? getSignalColor(signalType) : theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background: ${signalType ? getSignalColor(signalType) + 'dd' : theme.colors.primary + 'dd'};
        }
      `;
    }
    return `
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[700]};
      &:hover:not(:disabled) {
        background: ${theme.colors.gray[200]};
      }
    `;
  }}
`;

const TradeExecutionModal: React.FC<TradeExecutionModalProps> = ({
  isOpen,
  signal,
  onClose,
  onConfirm,
  isExecuting = false
}) => {

  if (!signal) return null;

  const handleConfirm = () => {
    if (signal.signal.action !== 'HOLD') {
      onConfirm(
        signal.id,
        signal.signal.action as 'BUY' | 'SELL',
        signal.targets.positionSize,
        signal.targets.entryPrice
      );
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isHoldSignal = signal.signal.action === 'HOLD';

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isHoldSignal ? <AlertTriangle size={24} /> : 
             signal.signal.action === 'BUY' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            {isHoldSignal ? '관망 신호' : '매매 실행 확인'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <SignalSummary signalType={signal.signal.action}>
            <SignalHeader>
              <CoinImage src={signal.coin.image} alt={signal.coin.name} />
              <CoinInfo>
                <CoinName>{signal.coin.name}</CoinName>
                <CoinPrice>{formatPrice(signal.coin.currentPrice)}</CoinPrice>
              </CoinInfo>
              <SignalBadge signalType={signal.signal.action}>
                {getSignalText(signal.signal.action)}
              </SignalBadge>
            </SignalHeader>
          </SignalSummary>

          {!isHoldSignal && (
            <>
              <TradeDetails>
                <DetailItem>
                  <DetailLabel>진입가</DetailLabel>
                  <DetailValue>{formatPrice(signal.targets.entryPrice)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>목표가</DetailLabel>
                  <DetailValue>{formatPrice(signal.targets.targetPrice)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>손절가</DetailLabel>
                  <DetailValue>{formatPrice(signal.targets.stopLoss)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>포지션 크기</DetailLabel>
                  <DetailValue>{formatPrice(signal.targets.positionSize)}</DetailValue>
                </DetailItem>
              </TradeDetails>

              <WarningSection>
                <WarningTitle>
                  <AlertTriangle size={16} />
                  주의사항
                </WarningTitle>
                <WarningText>
                  • 암호화폐 투자는 높은 위험을 수반합니다<br/>
                  • 투자 전 충분한 검토와 신중한 판단이 필요합니다<br/>
                  • 손실 가능성을 항상 염두에 두시기 바랍니다<br/>
                  • AI 추천은 참고용이며, 최종 투자 결정은 본인 책임입니다
                </WarningText>
              </WarningSection>
            </>
          )}

          {isHoldSignal && (
            <WarningSection>
              <WarningTitle>
                <CheckCircle size={16} />
                관망 신호
              </WarningTitle>
              <WarningText>
                현재 시장 상황을 분석한 결과, 매매보다는 관망을 권장합니다.<br/>
                시장 상황이 개선되면 새로운 신호를 제공해드리겠습니다.
              </WarningText>
            </WarningSection>
          )}

          <ActionButtons>
            <Button variant="secondary" onClick={handleClose} disabled={isExecuting}>
              취소
            </Button>
            {!isHoldSignal && (
              <Button
                variant="primary"
                signalType={signal.signal.action as 'BUY' | 'SELL'}
                onClick={handleConfirm}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>⏳ 실행 중...</>
                ) : (
                  <>
                    {signal.signal.action === 'BUY' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    {signal.signal.action === 'BUY' ? '매수 실행' : '매도 실행'}
                  </>
                )}
              </Button>
            )}
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TradeExecutionModal;
