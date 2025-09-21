// src/components/common/PerformanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye, 
  EyeOff,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Cpu,
  Wifi,
  HardDrive
} from 'lucide-react';
import { 
  usePerformanceMonitoring, 
  usePerformanceGrade, 
  usePerformanceAlerts,
  usePerformanceBenchmark 
} from '@/hooks/usePerformanceMonitoring';
import { media, responsiveTypography } from '@/utils/responsive';

const DashboardContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  z-index: 9999;
  overflow: hidden;
  transition: all 0.3s ease;

  ${media.max.md`
    width: 350px;
    top: 10px;
    right: 10px;
  `}

  ${media.max.sm`
    width: 320px;
    top: 5px;
    right: 5px;
  `}
`;

const DashboardHeader = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.bg.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DashboardTitle = styled.h3`
  ${responsiveTypography('lg', 'semibold')}
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const DashboardContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding: 1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media.max.sm`
    grid-template-columns: 1fr;
  `}
`;

const MetricCard = styled.div<{ grade?: 'good' | 'needs-improvement' | 'poor' }>`
  padding: 1rem;
  background: ${({ theme, grade }) => {
    switch (grade) {
      case 'good': return theme.colors.success.light;
      case 'needs-improvement': return theme.colors.warning.light;
      case 'poor': return theme.colors.error.light;
      default: return theme.colors.bg.secondary;
    }
  }};
  border: 1px solid ${({ theme, grade }) => {
    switch (grade) {
      case 'good': return theme.colors.success.main;
      case 'needs-improvement': return theme.colors.warning.main;
      case 'poor': return theme.colors.error.main;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MetricTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const MetricGrade = styled.div<{ grade: 'good' | 'needs-improvement' | 'poor' }>`
  font-size: 0.75rem;
  color: ${({ theme, grade }) => {
    switch (grade) {
      case 'good': return theme.colors.success.dark;
      case 'needs-improvement': return theme.colors.warning.dark;
      case 'poor': return theme.colors.error.dark;
      default: return theme.colors.text.tertiary;
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  ${responsiveTypography('md', 'semibold')}
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AlertList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const AlertItem = styled.div<{ grade: 'good' | 'needs-improvement' | 'poor' }>`
  padding: 0.75rem;
  background: ${({ theme, grade }) => {
    switch (grade) {
      case 'good': return theme.colors.success.light;
      case 'needs-improvement': return theme.colors.warning.light;
      case 'poor': return theme.colors.error.light;
      default: return theme.colors.bg.secondary;
    }
  }};
  border: 1px solid ${({ theme, grade }) => {
    switch (grade) {
      case 'good': return theme.colors.success.main;
      case 'needs-improvement': return theme.colors.warning.main;
      case 'poor': return theme.colors.error.main;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const AlertMetric = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const AlertValue = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const AlertTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ControlButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.main};
          color: white;
          &:hover {
            background: ${theme.colors.primary.dark};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error.main};
          color: white;
          &:hover {
            background: ${theme.colors.error.dark};
          }
        `;
      default:
        return `
          background: ${theme.colors.bg.secondary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover {
            background: ${theme.colors.gray[100]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PerformanceDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'alerts' | 'benchmarks'>('metrics');
  
  const { 
    metrics, 
    isMonitoring, 
    alerts, 
    startMonitoring, 
    stopMonitoring, 
    generateReport, 
    clearAlerts 
  } = usePerformanceMonitoring();
  
  const { getGradeColor, getGradeIcon } = usePerformanceGrade();
  const { alerts: performanceAlerts, dismissAlert, clearAlerts: clearPerformanceAlerts } = usePerformanceAlerts();
  const { benchmarks, getBenchmarkStats } = usePerformanceBenchmark();

  // 성능 리포트 다운로드
  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 성능 등급 계산
  const getMetricGrade = (metric: string, value: number | null) => {
    if (value === null) return 'good';
    // 간단한 등급 계산 로직
    if (metric === 'LCP' || metric === 'FCP' || metric === 'TTFB') {
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    }
    if (metric === 'FID') {
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    }
    if (metric === 'CLS') {
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    }
    return 'good';
  };

  if (!isVisible) {
    return (
      <ToggleButton onClick={() => setIsVisible(true)}>
        <BarChart3 size={20} />
      </ToggleButton>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>
          <Activity size={20} />
          Performance Monitor
        </DashboardTitle>
        <ToggleButton onClick={() => setIsVisible(false)}>
          <EyeOff size={16} />
        </ToggleButton>
      </DashboardHeader>

      <DashboardContent>
        <ControlButtons>
          <ControlButton
            variant={isMonitoring ? 'danger' : 'primary'}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
          >
            {isMonitoring ? <EyeOff size={16} /> : <Eye size={16} />}
            {isMonitoring ? 'Stop' : 'Start'}
          </ControlButton>
          
          <ControlButton onClick={downloadReport}>
            <Download size={16} />
            Report
          </ControlButton>
          
          <ControlButton variant="danger" onClick={clearPerformanceAlerts}>
            <Trash2 size={16} />
            Clear
          </ControlButton>
        </ControlButtons>

        {/* Core Web Vitals */}
        {metrics && (
          <Section>
            <SectionTitle>
              <Zap size={16} />
              Core Web Vitals
            </SectionTitle>
            <MetricsGrid>
              {Object.entries(metrics.coreWebVitals).map(([key, value]) => {
                const grade = getMetricGrade(key, value);
                return (
                  <MetricCard key={key} grade={grade}>
                    <MetricTitle>
                      {getGradeIcon(grade)}
                      {key}
                    </MetricTitle>
                    <MetricValue>
                      {value ? `${value.toFixed(2)}${key === 'CLS' ? '' : 'ms'}` : 'N/A'}
                    </MetricValue>
                    <MetricGrade grade={grade}>
                      {grade}
                    </MetricGrade>
                  </MetricCard>
                );
              })}
            </MetricsGrid>
          </Section>
        )}

        {/* Memory Usage */}
        {metrics && (
          <Section>
            <SectionTitle>
              <HardDrive size={16} />
              Memory Usage
            </SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricTitle>
                  <Cpu size={14} />
                  Used
                </MetricTitle>
                <MetricValue>
                  {(metrics.memoryUsage.used / 1024 / 1024).toFixed(2)} MB
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>
                  <TrendingUp size={14} />
                  Total
                </MetricTitle>
                <MetricValue>
                  {(metrics.memoryUsage.total / 1024 / 1024).toFixed(2)} MB
                </MetricValue>
              </MetricCard>
            </MetricsGrid>
          </Section>
        )}

        {/* Network Metrics */}
        {metrics && (
          <Section>
            <SectionTitle>
              <Wifi size={16} />
              Network
            </SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricTitle>
                  <Activity size={14} />
                  Requests
                </MetricTitle>
                <MetricValue>
                  {metrics.networkMetrics.requests}
                </MetricValue>
              </MetricCard>
              <MetricCard>
                <MetricTitle>
                  <Clock size={14} />
                  Avg Response
                </MetricTitle>
                <MetricValue>
                  {metrics.networkMetrics.averageResponseTime.toFixed(2)}ms
                </MetricValue>
              </MetricCard>
            </MetricsGrid>
          </Section>
        )}

        {/* Performance Alerts */}
        {performanceAlerts.length > 0 && (
          <Section>
            <SectionTitle>
              <AlertTriangle size={16} />
              Performance Alerts ({performanceAlerts.length})
            </SectionTitle>
            <AlertList>
              {performanceAlerts.slice(0, 5).map((alert, index) => (
                <AlertItem key={alert.id} grade={alert.grade}>
                  <AlertInfo>
                    <AlertMetric>{alert.metric}</AlertMetric>
                    <AlertValue>{alert.value.toFixed(2)}</AlertValue>
                    <AlertTime>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </AlertTime>
                  </AlertInfo>
                  <ToggleButton onClick={() => dismissAlert(alert.id)}>
                    ×
                  </ToggleButton>
                </AlertItem>
              ))}
            </AlertList>
          </Section>
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default PerformanceDashboard;
