import React from 'react';
import styled from 'styled-components';
import MainLayout from '@/components/common/MainLayout';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px dashed ${({ theme }) => theme.colors.gray[200]};
`;

const SettingsTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0 0 1rem 0;
`;

const SettingsText = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
  margin: 0;
`;

const Settings: React.FC = () => {
  return (
    <MainLayout 
      title="⚙️ 설정" 
      description="알림, 언어, 테마 등 앱 설정을 관리하세요"
    >
      <SettingsContainer>
        <SettingsCard>
          <SettingsTitle>🔔 알림 설정</SettingsTitle>
          <SettingsText>
            매매 신호, 가격 변동, 뉴스 등 다양한 알림을 설정할 수 있습니다.
          </SettingsText>
        </SettingsCard>

        <SettingsCard>
          <SettingsTitle>🌐 언어 설정</SettingsTitle>
          <SettingsText>
            한국어, 영어 등 다양한 언어를 선택할 수 있습니다.
          </SettingsText>
        </SettingsCard>

        <SettingsCard>
          <SettingsTitle>🎨 테마 설정</SettingsTitle>
          <SettingsText>
            라이트 모드, 다크 모드 등 테마를 변경할 수 있습니다.
          </SettingsText>
        </SettingsCard>

        <SettingsCard>
          <SettingsTitle>🔒 개인정보 보호</SettingsTitle>
          <SettingsText>
            개인정보 처리방침, 데이터 삭제 등 개인정보 관련 설정입니다.
          </SettingsText>
        </SettingsCard>

        <SettingsCard>
          <SettingsTitle>📱 앱 정보</SettingsTitle>
          <SettingsText>
            버전 정보, 업데이트 내역, 개발자 정보 등을 확인할 수 있습니다.
          </SettingsText>
        </SettingsCard>
      </SettingsContainer>
    </MainLayout>
  );
};

export default Settings;
