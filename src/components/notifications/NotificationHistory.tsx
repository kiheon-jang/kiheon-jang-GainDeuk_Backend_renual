import React, { useState } from 'react';
import styled from 'styled-components';
import { History, Trash2, Eye, EyeOff, Filter } from 'lucide-react';
import type { NotificationData, NotificationType } from '@/types/notifications';
import { NOTIFICATION_TYPE_CONFIG } from '@/types/notifications';

interface NotificationHistoryProps {
  notifications: NotificationData[];
  onClearHistory: () => void;
}

const HistoryCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HistoryIcon = styled.div`
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HistoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HistoryDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.5rem 0 0 0;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.danger}15;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.danger}25;
    border-color: ${({ theme }) => theme.colors.danger}60;
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NotificationItem = styled.div<{ type: NotificationType }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-left: 4px solid ${({ type }) => NOTIFICATION_TYPE_CONFIG[type].color};
  transition: all ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.background.primary};
    box-shadow: ${({ theme }) => theme.shadows.SM};
  }
`;

const NotificationIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
`;

const NotificationMessage = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  word-break: break-word;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: ${({ theme }) => theme.fonts.size.XS};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: 0.125rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.SM};
  font-size: ${({ theme }) => theme.fonts.size.XS};
  font-weight: 500;
  text-transform: uppercase;
  
  ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent':
        return `
          background: ${theme.colors.danger}15;
          color: ${theme.colors.danger};
        `;
      case 'high':
        return `
          background: ${theme.colors.warning}15;
          color: ${theme.colors.warning};
        `;
      case 'medium':
        return `
          background: ${theme.colors.info}15;
          color: ${theme.colors.info};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[600]};
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const NotificationHistory: React.FC<NotificationHistoryProps> = ({ 
  notifications, 
  onClearHistory 
}) => {
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [showDetails, setShowDetails] = useState(false);

  const filteredNotifications = notifications.filter(notification => 
    filterType === 'all' || notification.type === filterType
  );

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // 1분 미만
      return '방금 전';
    } else if (diff < 3600000) { // 1시간 미만
      return `${Math.floor(diff / 60000)}분 전`;
    } else if (diff < 86400000) { // 1일 미만
      return `${Math.floor(diff / 3600000)}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'urgent': return '긴급';
      case 'high': return '높음';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return priority;
    }
  };

  return (
    <HistoryCard>
      <HistoryHeader>
        <HeaderLeft>
          <HistoryIcon>
            <History size={24} />
          </HistoryIcon>
          <div>
            <HistoryTitle>알림 히스토리</HistoryTitle>
            <HistoryDescription>
              최근 알림 기록을 확인할 수 있습니다. (최대 {notifications.length}개)
            </HistoryDescription>
          </div>
        </HeaderLeft>
        <ClearButton onClick={onClearHistory}>
          <Trash2 size={16} />
          전체 삭제
        </ClearButton>
      </HistoryHeader>

      {notifications.length > 0 && (
        <FilterSection>
          <FilterLabel>
            <Filter size={16} />
            필터:
          </FilterLabel>
          <FilterSelect 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as NotificationType | 'all')}
          >
            <option value="all">전체</option>
            <option value="success">성공</option>
            <option value="error">오류</option>
            <option value="warning">경고</option>
            <option value="info">정보</option>
            <option value="trading_signal">매매신호</option>
            <option value="price_alert">가격알림</option>
            <option value="news_alert">뉴스</option>
            <option value="market_update">시장업데이트</option>
          </FilterSelect>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: 'none',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#6B7280'
            }}
          >
            {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            {showDetails ? '간단히' : '자세히'}
          </button>
        </FilterSection>
      )}

      {filteredNotifications.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <EmptyTitle>알림 기록이 없습니다</EmptyTitle>
          <EmptyDescription>
            {filterType === 'all' 
              ? '아직 알림이 발생하지 않았습니다.' 
              : `${filterType} 타입의 알림이 없습니다.`
            }
          </EmptyDescription>
        </EmptyState>
      ) : (
        <NotificationList>
          {filteredNotifications.map((notification) => {
            const config = NOTIFICATION_TYPE_CONFIG[notification.type];
            return (
              <NotificationItem key={notification.id} type={notification.type}>
                <NotificationIcon>
                  {config.icon}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationMeta>
                    <span>{formatTime(notification.timestamp)}</span>
                    <PriorityBadge priority={notification.priority}>
                      {getPriorityText(notification.priority)}
                    </PriorityBadge>
                    {showDetails && (
                      <>
                        <span>ID: {notification.id.slice(-8)}</span>
                        {notification.duration && (
                          <span>지속시간: {notification.duration}ms</span>
                        )}
                      </>
                    )}
                  </NotificationMeta>
                </NotificationContent>
              </NotificationItem>
            );
          })}
        </NotificationList>
      )}
    </HistoryCard>
  );
};

export default NotificationHistory;
