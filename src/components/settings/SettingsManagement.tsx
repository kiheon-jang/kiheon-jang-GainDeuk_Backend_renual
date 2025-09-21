import React, { useRef } from 'react';
import styled from 'styled-components';
import { Download, Upload, RotateCcw, Info } from 'lucide-react';

interface SettingsManagementProps {
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
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

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.FAST};
  cursor: pointer;
  border: 2px solid transparent;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.primary}dd;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.danger}15;
          color: ${theme.colors.danger};
          border-color: ${theme.colors.danger}40;
          &:hover {
            background: ${theme.colors.danger}25;
            border-color: ${theme.colors.danger}60;
          }
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.text.primary};
          border-color: ${theme.colors.border.primary};
          &:hover {
            background: ${theme.colors.gray[200]};
            border-color: ${theme.colors.border.secondary};
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const InfoSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

const InfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const SettingsManagement: React.FC<SettingsManagementProps> = ({
  onReset,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  return (
    <SettingsCard>
      <SettingsHeader>
        <SettingsIcon>
          <Info size={24} />
        </SettingsIcon>
        <div>
          <SettingsTitle>설정 관리</SettingsTitle>
          <SettingsDescription>
            설정을 내보내기, 가져오기, 초기화할 수 있습니다.
          </SettingsDescription>
        </div>
      </SettingsHeader>

      <ActionsGrid>
        <ActionButton $variant="primary" onClick={onExport}>
          <Download size={20} />
          설정 내보내기
        </ActionButton>

        <ActionButton onClick={handleImportClick}>
          <Upload size={20} />
          설정 가져오기
        </ActionButton>

        <ActionButton $variant="danger" onClick={onReset}>
          <RotateCcw size={20} />
          설정 초기화
        </ActionButton>
      </ActionsGrid>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
      />

      <InfoSection>
        <InfoTitle>
          <Info size={16} />
          설정 관리 안내
        </InfoTitle>
        <InfoText>
          • <strong>내보내기</strong>: 현재 설정을 JSON 파일로 저장합니다.<br/>
          • <strong>가져오기</strong>: 이전에 내보낸 설정 파일을 불러옵니다.<br/>
          • <strong>초기화</strong>: 모든 설정을 기본값으로 되돌립니다. 이 작업은 되돌릴 수 없습니다.
        </InfoText>
      </InfoSection>
    </SettingsCard>
  );
};

export default SettingsManagement;
