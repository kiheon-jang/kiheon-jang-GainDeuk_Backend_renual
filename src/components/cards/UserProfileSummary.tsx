import React from 'react';
import styled from 'styled-components';
import type { UserProfile } from '@/types';

interface UserProfileSummaryProps {
  profile: UserProfile;
  onEditClick?: () => void;
}

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ProfileTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProfileLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
  min-width: 80px;
`;

const ProfileValue = styled.span<{ type?: 'style' | 'level' | 'strategy' }>`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  background: ${({ type, theme }) => {
    switch (type) {
      case 'style':
        return `${theme.colors.primary}15`;
      case 'level':
        return `${theme.colors.secondary}15`;
      case 'strategy':
        return `${theme.colors.warning}15`;
      default:
        return theme.colors.gray[50];
    }
  }};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'style':
        return theme.colors.primary;
      case 'level':
        return theme.colors.secondary;
      case 'strategy':
        return theme.colors.warning;
      default:
        return theme.colors.gray[900];
    }
  }};
`;

const StrategyDescription = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  margin-top: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
`;

const getInvestmentStyleText = (style: string) => {
  switch (style) {
    case 'conservative':
      return '🛡️ 안정형';
    case 'moderate':
      return '⚖️ 균형형';
    case 'aggressive':
      return '🚀 공격형';
    default:
      return style;
  }
};

const getExperienceLevelText = (level: string) => {
  switch (level) {
    case 'beginner':
      return '🌱 초심자';
    case 'intermediate':
      return '📈 중급자';
    case 'advanced':
      return '🎯 고급자';
    default:
      return level;
  }
};

const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({ 
  profile, 
  onEditClick 
}) => {
  return (
    <ProfileCard>
      <ProfileHeader>
        <ProfileTitle>
          👤 내 투자 성향
        </ProfileTitle>
        {onEditClick && (
          <EditButton onClick={onEditClick}>
            수정하기
          </EditButton>
        )}
      </ProfileHeader>

      <ProfileContent>
        <ProfileItem>
          <ProfileLabel>투자 성향:</ProfileLabel>
          <ProfileValue type="style">
            {getInvestmentStyleText(profile.investmentStyle)}
          </ProfileValue>
        </ProfileItem>

        <ProfileItem>
          <ProfileLabel>경험 수준:</ProfileLabel>
          <ProfileValue type="level">
            {getExperienceLevelText(profile.experienceLevel)}
          </ProfileValue>
        </ProfileItem>

        <ProfileItem>
          <ProfileLabel>위험 감수도:</ProfileLabel>
          <ProfileValue>
            {profile.riskTolerance}/10
          </ProfileValue>
        </ProfileItem>

        <div>
          <ProfileLabel>추천 전략:</ProfileLabel>
          <StrategyDescription>
            {profile.recommendedStrategy}
          </StrategyDescription>
        </div>
      </ProfileContent>
    </ProfileCard>
  );
};

export default UserProfileSummary;
