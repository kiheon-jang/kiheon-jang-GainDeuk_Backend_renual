import React from 'react';
import styled from 'styled-components';
import { Bell, Volume2, Smartphone } from 'lucide-react';
import type { NotificationSettings as NotificationSettingsType } from '@/types/settings';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: Partial<NotificationSettingsType>) => void;
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

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onUpdate }) => {
  const handleToggle = (key: keyof NotificationSettingsType) => {
    onUpdate({ [key]: !settings[key] });
  };

  return (
    <SettingsCard>
      <SettingsHeader>
        <SettingsIcon>
          <Bell size={24} />
        </SettingsIcon>
        <div>
          <SettingsTitle>알림 설정</SettingsTitle>
          <SettingsDescription>
            매매 신호, 가격 변동, 뉴스 등 다양한 알림을 설정할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <GroupTitle>
            <Bell size={20} />
            알림 유형
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="tradingSignals">매매 신호 알림</SettingLabel>
              <SettingDescription>
                AI가 생성한 매매 신호에 대한 실시간 알림을 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.tradingSignals}>
              <input
                type="checkbox"
                id="tradingSignals"
                checked={settings.tradingSignals}
                onChange={() => handleToggle('tradingSignals')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="priceAlerts">가격 알림</SettingLabel>
              <SettingDescription>
                관심 코인의 가격 변동에 대한 알림을 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.priceAlerts}>
              <input
                type="checkbox"
                id="priceAlerts"
                checked={settings.priceAlerts}
                onChange={() => handleToggle('priceAlerts')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="newsAlerts">뉴스 알림</SettingLabel>
              <SettingDescription>
                암호화폐 관련 중요 뉴스에 대한 알림을 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.newsAlerts}>
              <input
                type="checkbox"
                id="newsAlerts"
                checked={settings.newsAlerts}
                onChange={() => handleToggle('newsAlerts')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="marketUpdates">시장 업데이트</SettingLabel>
              <SettingDescription>
                시장 상황 변화에 대한 정기적인 업데이트를 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.marketUpdates}>
              <input
                type="checkbox"
                id="marketUpdates"
                checked={settings.marketUpdates}
                onChange={() => handleToggle('marketUpdates')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Smartphone size={20} />
            알림 방법
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="pushNotifications">푸시 알림</SettingLabel>
              <SettingDescription>
                브라우저 푸시 알림을 통해 알림을 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.pushNotifications}>
              <input
                type="checkbox"
                id="pushNotifications"
                checked={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="emailNotifications">이메일 알림</SettingLabel>
              <SettingDescription>
                이메일을 통해 알림을 받습니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.emailNotifications}>
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Volume2 size={20} />
            알림 효과
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="soundEnabled">소리</SettingLabel>
              <SettingDescription>
                알림 시 소리를 재생합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.soundEnabled}>
              <input
                type="checkbox"
                id="soundEnabled"
                checked={settings.soundEnabled}
                onChange={() => handleToggle('soundEnabled')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="vibrationEnabled">진동</SettingLabel>
              <SettingDescription>
                모바일 기기에서 알림 시 진동을 울립니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.vibrationEnabled}>
              <input
                type="checkbox"
                id="vibrationEnabled"
                checked={settings.vibrationEnabled}
                onChange={() => handleToggle('vibrationEnabled')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>
      </SettingsGrid>
    </SettingsCard>
  );
};

export default NotificationSettings;
