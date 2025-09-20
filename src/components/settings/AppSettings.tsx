import React from 'react';
import styled from 'styled-components';
import { Settings, RefreshCw, Eye, Bug } from 'lucide-react';
import type { AppSettings as AppSettingsType } from '@/types/settings';

interface AppSettingsProps {
  settings: AppSettingsType;
  onUpdate: (settings: Partial<AppSettingsType>) => void;
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

const ToggleSwitch = styled.label<{ checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.gray[300]};
    transition: ${({ theme }) => theme.transitions.FAST};
    border-radius: 1.5rem;

    &:before {
      position: absolute;
      content: "";
      height: 1.25rem;
      width: 1.25rem;
      left: 0.125rem;
      bottom: 0.125rem;
      background-color: white;
      transition: ${({ theme }) => theme.transitions.FAST};
      border-radius: 50%;
    }
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  input:checked + .slider:before {
    transform: translateX(1.5rem);
  }
`;

const AppSettings: React.FC<AppSettingsProps> = ({ settings, onUpdate }) => {
  const handleAutoRefreshToggle = () => {
    onUpdate({ autoRefresh: !settings.autoRefresh });
  };

  const handleRefreshIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ refreshInterval: parseInt(e.target.value) });
  };

  const handleAdvancedFeaturesToggle = () => {
    onUpdate({ showAdvancedFeatures: !settings.showAdvancedFeatures });
  };

  const handleDebugModeToggle = () => {
    onUpdate({ debugMode: !settings.debugMode });
  };

  return (
    <SettingsCard>
      <SettingsHeader>
        <SettingsIcon>
          <Settings size={24} />
        </SettingsIcon>
        <div>
          <SettingsTitle>앱 설정</SettingsTitle>
          <SettingsDescription>
            앱의 동작 방식과 고급 기능을 설정할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <GroupTitle>
            <RefreshCw size={20} />
            데이터 새로고침
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="autoRefresh">자동 새로고침</SettingLabel>
              <SettingDescription>
                데이터를 자동으로 새로고침합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.autoRefresh}>
              <input
                type="checkbox"
                id="autoRefresh"
                checked={settings.autoRefresh}
                onChange={handleAutoRefreshToggle}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="refreshInterval">새로고침 간격</SettingLabel>
              <SettingDescription>
                데이터를 새로고침하는 간격을 설정하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="refreshInterval"
              value={settings.refreshInterval}
              onChange={handleRefreshIntervalChange}
              disabled={!settings.autoRefresh}
            >
              <option value="10">10초</option>
              <option value="30">30초</option>
              <option value="60">1분</option>
              <option value="300">5분</option>
              <option value="600">10분</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Eye size={20} />
            고급 기능
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="showAdvancedFeatures">고급 기능 표시</SettingLabel>
              <SettingDescription>
                숨겨진 고급 기능들을 표시합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.showAdvancedFeatures}>
              <input
                type="checkbox"
                id="showAdvancedFeatures"
                checked={settings.showAdvancedFeatures}
                onChange={handleAdvancedFeaturesToggle}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Bug size={20} />
            개발자 옵션
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="debugMode">디버그 모드</SettingLabel>
              <SettingDescription>
                개발자용 디버그 정보를 표시합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.debugMode}>
              <input
                type="checkbox"
                id="debugMode"
                checked={settings.debugMode}
                onChange={handleDebugModeToggle}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>
      </SettingsGrid>
    </SettingsCard>
  );
};

export default AppSettings;
