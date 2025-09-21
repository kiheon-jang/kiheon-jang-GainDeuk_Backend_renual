import React from 'react';
import styled from 'styled-components';
import { Bell, Volume2, Smartphone, Settings, TestTube } from 'lucide-react';
import type { NotificationSettings as NotificationSettingsType } from '@/types/notifications';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onUpdate: (settings: Partial<NotificationSettingsType>) => void;
  onTestNotification: (type: 'success' | 'error' | 'warning' | 'info' | 'trading_signal' | 'price_alert') => void;
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

const TestButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.SM};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;
  border: 1px solid transparent;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.primary}dd;
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.danger}15;
          color: ${theme.colors.danger};
          border-color: ${theme.colors.danger}40;
          &:hover {
            background: ${theme.colors.danger}25;
          }
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.border.primary};
          &:hover {
            background: ${theme.colors.gray[200]};
          }
        `;
    }
  }}
`;

const TestButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  onUpdate, 
  onTestNotification 
}) => {
  const handleToggle = (key: keyof NotificationSettingsType) => {
    onUpdate({ [key]: !settings[key] });
  };


  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ duration: parseInt(e.target.value) });
  };

  const handleMaxVisibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ maxVisible: parseInt(e.target.value) });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ position: e.target.value as any });
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
            알림 표시 방식, 사운드, 진동 등을 설정할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <GroupTitle>
            <Settings size={20} />
            기본 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="enabled">알림 활성화</SettingLabel>
              <SettingDescription>
                모든 알림을 활성화하거나 비활성화합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.enabled}>
              <input
                type="checkbox"
                id="enabled"
                checked={settings.enabled}
                onChange={() => handleToggle('enabled')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="desktopNotifications">데스크톱 알림</SettingLabel>
              <SettingDescription>
                브라우저 데스크톱 알림을 사용합니다.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.desktopNotifications}>
              <input
                type="checkbox"
                id="desktopNotifications"
                checked={settings.desktopNotifications}
                onChange={() => handleToggle('desktopNotifications')}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Volume2 size={20} />
            사운드 및 진동
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="soundEnabled">사운드</SettingLabel>
              <SettingDescription>
                알림 시 사운드를 재생합니다.
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

        <SettingGroup>
          <GroupTitle>
            <Smartphone size={20} />
            표시 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="duration">기본 표시 시간</SettingLabel>
              <SettingDescription>
                알림이 표시되는 기본 시간을 설정하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="duration"
              value={settings.duration}
              onChange={handleDurationChange}
            >
              <option value={2000}>2초</option>
              <option value={3000}>3초</option>
              <option value={5000}>5초</option>
              <option value={7000}>7초</option>
              <option value={10000}>10초</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="maxVisible">최대 표시 개수</SettingLabel>
              <SettingDescription>
                동시에 표시할 수 있는 최대 알림 개수입니다.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="maxVisible"
              value={settings.maxVisible}
              onChange={handleMaxVisibleChange}
            >
              <option value={3}>3개</option>
              <option value={5}>5개</option>
              <option value={7}>7개</option>
              <option value={10}>10개</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="position">표시 위치</SettingLabel>
              <SettingDescription>
                알림이 표시될 화면 위치를 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="position"
              value={settings.position}
              onChange={handlePositionChange}
            >
              <option value="top-right">우상단</option>
              <option value="top-left">좌상단</option>
              <option value="bottom-right">우하단</option>
              <option value="bottom-left">좌하단</option>
              <option value="top-center">상단 중앙</option>
              <option value="bottom-center">하단 중앙</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <TestTube size={20} />
            알림 테스트
          </GroupTitle>
          
          <div>
            <SettingDescription>
              다양한 알림 타입을 테스트해보세요.
            </SettingDescription>
            <TestButtonsGrid>
              <TestButton onClick={() => onTestNotification('success')}>
                ✅ 성공
              </TestButton>
              <TestButton $variant="danger" onClick={() => onTestNotification('error')}>
                ❌ 오류
              </TestButton>
              <TestButton onClick={() => onTestNotification('warning')}>
                ⚠️ 경고
              </TestButton>
              <TestButton onClick={() => onTestNotification('info')}>
                ℹ️ 정보
              </TestButton>
              <TestButton $variant="primary" onClick={() => onTestNotification('trading_signal')}>
                📈 매매신호
              </TestButton>
              <TestButton $variant="primary" onClick={() => onTestNotification('price_alert')}>
                💰 가격알림
              </TestButton>
            </TestButtonsGrid>
          </div>
        </SettingGroup>
      </SettingsGrid>
    </SettingsCard>
  );
};

export default NotificationSettings;
