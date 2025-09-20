import React from 'react';
import styled from 'styled-components';
import { Globe, Calendar, DollarSign } from 'lucide-react';
import type { LanguageSettings as LanguageSettingsType } from '@/types/settings';

interface LanguageSettingsProps {
  settings: LanguageSettingsType;
  onUpdate: (settings: Partial<LanguageSettingsType>) => void;
}

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SettingsIcon = styled.div`
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SettingsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const SettingsDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.5rem 0 0 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GroupTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.LG};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.label`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const SettingDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.25rem 0 0 0;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }
`;

const LanguageSettings: React.FC<LanguageSettingsProps> = ({ settings, onUpdate }) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ language: e.target.value as 'ko' | 'en' });
  };

  const handleDateFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ dateFormat: e.target.value as 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' });
  };

  const handleTimeFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ timeFormat: e.target.value as '24h' | '12h' });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ currency: e.target.value as 'KRW' | 'USD' | 'EUR' });
  };

  return (
    <SettingsCard>
      <SettingsHeader>
        <SettingsIcon>
          <Globe size={24} />
        </SettingsIcon>
        <div>
          <SettingsTitle>언어 및 지역 설정</SettingsTitle>
          <SettingsDescription>
            언어, 날짜 형식, 시간 형식, 통화 등을 설정할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <GroupTitle>
            <Globe size={20} />
            언어 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="language">언어</SettingLabel>
              <SettingDescription>
                앱에서 사용할 언어를 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="language"
              value={settings.language}
              onChange={handleLanguageChange}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Calendar size={20} />
            날짜 및 시간 형식
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="dateFormat">날짜 형식</SettingLabel>
              <SettingDescription>
                날짜를 표시하는 형식을 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="dateFormat"
              value={settings.dateFormat}
              onChange={handleDateFormatChange}
            >
              <option value="YYYY-MM-DD">2024-01-15 (YYYY-MM-DD)</option>
              <option value="MM/DD/YYYY">01/15/2024 (MM/DD/YYYY)</option>
              <option value="DD/MM/YYYY">15/01/2024 (DD/MM/YYYY)</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="timeFormat">시간 형식</SettingLabel>
              <SettingDescription>
                시간을 표시하는 형식을 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="timeFormat"
              value={settings.timeFormat}
              onChange={handleTimeFormatChange}
            >
              <option value="24h">24시간 형식 (14:30)</option>
              <option value="12h">12시간 형식 (2:30 PM)</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <DollarSign size={20} />
            통화 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="currency">기본 통화</SettingLabel>
              <SettingDescription>
                가격을 표시할 때 사용할 기본 통화를 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="currency"
              value={settings.currency}
              onChange={handleCurrencyChange}
            >
              <option value="KRW">한국 원 (₩)</option>
              <option value="USD">미국 달러 ($)</option>
              <option value="EUR">유로 (€)</option>
            </Select>
          </SettingItem>
        </SettingGroup>
      </SettingsGrid>
    </SettingsCard>
  );
};

export default LanguageSettings;
