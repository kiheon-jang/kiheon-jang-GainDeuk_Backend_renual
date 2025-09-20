import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

/**
 * 네비게이션 상태와 함수를 관리하는 훅
 */
export const useNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // 현재 경로
  const currentPath = location.pathname;

  // 네비게이션 함수
  const handleNavigate = useCallback((path: string) => {
    if (isNavigating) return; // 중복 네비게이션 방지
    
    setIsNavigating(true);
    
    // React Router를 사용한 네비게이션
    navigate(path);
    
    // 네비게이션 상태 리셋 (짧은 지연 후)
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  }, [navigate, isNavigating]);

  // 특정 경로로 이동하는 헬퍼 함수들
  const goToDashboard = useCallback(() => {
    handleNavigate(ROUTES.DASHBOARD);
  }, [handleNavigate]);

  const goToTrading = useCallback(() => {
    handleNavigate(ROUTES.TRADING);
  }, [handleNavigate]);

  const goToProfile = useCallback(() => {
    handleNavigate(ROUTES.PROFILE);
  }, [handleNavigate]);

  const goToCoins = useCallback(() => {
    handleNavigate(ROUTES.COINS);
  }, [handleNavigate]);

  const goToSettings = useCallback(() => {
    handleNavigate(ROUTES.SETTINGS);
  }, [handleNavigate]);

  // 뒤로 가기
  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // 히스토리가 없으면 대시보드로 이동
      handleNavigate(ROUTES.DASHBOARD);
    }
  }, [navigate, handleNavigate]);

  // 현재 페이지가 특정 경로인지 확인하는 헬퍼 함수들
  const isDashboard = currentPath === ROUTES.DASHBOARD;
  const isTrading = currentPath === ROUTES.TRADING;
  const isProfile = currentPath === ROUTES.PROFILE;
  const isCoins = currentPath === ROUTES.COINS;
  const isSettings = currentPath === ROUTES.SETTINGS;

  // 모바일에서 하단 네비게이션 표시 여부
  const showMobileNavigation = [
    ROUTES.DASHBOARD,
    ROUTES.TRADING,
    ROUTES.PROFILE,
    ROUTES.COINS,
    ROUTES.SETTINGS,
  ].includes(currentPath);

  return {
    // 상태
    currentPath,
    isNavigating,
    showMobileNavigation,
    
    // 네비게이션 함수
    navigate: handleNavigate,
    goBack,
    
    // 특정 페이지로 이동하는 함수들
    goToDashboard,
    goToTrading,
    goToProfile,
    goToCoins,
    goToSettings,
    
    // 현재 페이지 확인 함수들
    isDashboard,
    isTrading,
    isProfile,
    isCoins,
    isSettings,
  };
};
