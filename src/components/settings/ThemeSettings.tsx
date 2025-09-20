import React from 'react';
import styled from 'styled-components';
import { Palette, Monitor, Type, Eye } from 'lucide-react';
import type { ThemeSettings as ThemeSettingsType } from '@/types/settings';

interface ThemeSettingsProps {
  settings: ThemeSettingsType;
  onUpdate: (settings: Partial<ThemeSettingsType>) => void;
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

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ColorOption = styled.button<{ color: string; isSelected: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : 'transparent'};
  background-color: ${({ color }) => color};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: white;
    opacity: ${({ isSelected }) => isSelected ? 1 : 0};
    transition: opacity ${({ theme }) => theme.transitions.FAST};
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

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ settings, onUpdate }) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ mode: e.target.value as 'light' | 'dark' | 'auto' });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ fontSize: e.target.value as 'small' | 'medium' | 'large' });
  };

  const handleColorChange = (color: string) => {
    onUpdate({ primaryColor: color });
  };

  const handleReducedMotionToggle = () => {
    onUpdate({ reducedMotion: !settings.reducedMotion });
  };

  const colorOptions = [
    { name: '파란색', value: '#3B82F6' },
    { name: '보라색', value: '#8B5CF6' },
    { name: '초록색', value: '#10B981' },
    { name: '빨간색', value: '#EF4444' },
    { name: '주황색', value: '#F59E0B' },
    { name: '핑크색', value: '#EC4899' },
  ];

  return (
    <SettingsCard>
      <SettingsHeader>
        <SettingsIcon>
          <Palette size={24} />
        </SettingsIcon>
        <div>
          <SettingsTitle>테마 및 디스플레이 설정</SettingsTitle>
          <SettingsDescription>
            테마 모드, 색상, 폰트 크기 등을 설정할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <GroupTitle>
            <Monitor size={20} />
            테마 모드
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="mode">테마 모드</SettingLabel>
              <SettingDescription>
                앱의 테마 모드를 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="mode"
              value={settings.mode}
              onChange={handleModeChange}
            >
              <option value="light">라이트 모드</option>
              <option value="dark">다크 모드</option>
              <option value="auto">시스템 설정 따르기</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Palette size={20} />
            색상 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>주요 색상</SettingLabel>
              <SettingDescription>
                앱의 주요 색상을 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <ColorPicker>
              {colorOptions.map((color) => (
                <ColorOption
                  key={color.value}
                  color={color.value}
                  isSelected={settings.primaryColor === color.value}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                />
              ))}
            </ColorPicker>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Type size={20} />
            텍스트 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="fontSize">폰트 크기</SettingLabel>
              <SettingDescription>
                앱의 텍스트 크기를 선택하세요.
              </SettingDescription>
            </SettingInfo>
            <Select
              id="fontSize"
              value={settings.fontSize}
              onChange={handleFontSizeChange}
            >
              <option value="small">작게</option>
              <option value="medium">보통</option>
              <option value="large">크게</option>
            </Select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup>
          <GroupTitle>
            <Eye size={20} />
            접근성 설정
          </GroupTitle>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel htmlFor="reducedMotion">움직임 줄이기</SettingLabel>
              <SettingDescription>
                애니메이션과 전환 효과를 줄여서 사용하세요.
              </SettingDescription>
            </SettingInfo>
            <ToggleSwitch checked={settings.reducedMotion}>
              <input
                type="checkbox"
                id="reducedMotion"
                checked={settings.reducedMotion}
                onChange={handleReducedMotionToggle}
              />
              <span className="slider" />
            </ToggleSwitch>
          </SettingItem>
        </SettingGroup>
      </SettingsGrid>
    </SettingsCard>
  );
};

export default ThemeSettings;
