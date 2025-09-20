import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import type { InvestmentTest } from '@/types';

interface InvestmentTestFormProps {
  testData: InvestmentTest;
  onSubmit: (answers: Record<number, number>) => void;
  onRetake?: () => void;
}

const TestContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.LG};
  box-shadow: ${({ theme }) => theme.shadows.LG};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.SM};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const QuestionText = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${({ isSelected, theme }) => isSelected ? `${theme.colors.primary}15` : theme.colors.gray[50]};
  border: 2px solid ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.FAST};
  text-align: left;
  width: 100%;

  &:hover {
    background: ${({ isSelected, theme }) => isSelected ? `${theme.colors.primary}20` : theme.colors.gray[100]};
    border-color: ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.gray[300]};
  }
`;

const OptionRadio = styled.div<{ isSelected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.gray[400]};
  background: ${({ isSelected, theme }) => isSelected ? theme.colors.primary : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ isSelected }) => isSelected && `
    &::after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: white;
    }
  `}
`;

const OptionText = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: 500;
  line-height: 1.5;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const NavButton = styled.button<{ variant: 'primary' | 'secondary'; disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.MD};
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.FAST};
  border: none;

  ${({ variant, disabled, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${disabled ? '#9CA3AF' : theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background: ${disabled ? '#9CA3AF' : theme.colors.primary + 'dd'};
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

const CompletionMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const CompletionIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const CompletionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.XL};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 1rem 0;
`;

const CompletionText = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.BASE};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 2rem 0;
  line-height: 1.5;
`;

const InvestmentTestForm: React.FC<InvestmentTestFormProps> = ({
  testData,
  onSubmit,
  onRetake
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = testData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;
  const isLastQuestion = currentQuestion === testData.questions.length - 1;

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
      onSubmit(answers);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    onRetake?.();
  };

  const canProceed = answers[currentQ.id] !== undefined;

  if (isCompleted) {
    return (
      <TestContainer>
        <CompletionMessage>
          <CompletionIcon>🎉</CompletionIcon>
          <CompletionTitle>테스트 완료!</CompletionTitle>
          <CompletionText>
            투자 성향 분석이 완료되었습니다.<br/>
            AI가 당신에게 맞는 투자 전략을 추천해드리겠습니다.
          </CompletionText>
          <NavButton variant="primary" onClick={handleRetake}>
            다시 테스트하기
          </NavButton>
        </CompletionMessage>
      </TestContainer>
    );
  }

  return (
    <TestContainer>
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <QuestionContainer>
        <QuestionNumber>
          질문 {currentQuestion + 1} / {testData.questions.length}
        </QuestionNumber>
        <QuestionText>{currentQ.question}</QuestionText>

        <OptionsList>
          {currentQ.options.map((option, index) => (
            <OptionButton
              key={index}
              isSelected={answers[currentQ.id] === index}
              onClick={() => handleOptionSelect(index)}
            >
              <OptionRadio isSelected={answers[currentQ.id] === index} />
              <OptionText>{option.text}</OptionText>
            </OptionButton>
          ))}
        </OptionsList>
      </QuestionContainer>

      <NavigationButtons>
        <NavButton
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft size={20} />
          이전
        </NavButton>

        <NavButton
          variant="primary"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {isLastQuestion ? (
            <>
              <CheckCircle size={20} />
              완료
            </>
          ) : (
            <>
              다음
              <ChevronRight size={20} />
            </>
          )}
        </NavButton>
      </NavigationButtons>
    </TestContainer>
  );
};

export default InvestmentTestForm;
