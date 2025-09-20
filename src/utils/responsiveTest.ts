/**
 * 반응형 디자인 테스트를 위한 유틸리티 함수들
 */

// 브레이크포인트 정의
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  '2XL': 1400,
} as const;

// 디바이스 타입 정의
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
} as const;

/**
 * 현재 화면 크기에 따른 디바이스 타입 반환
 */
export const getDeviceType = (): keyof typeof DEVICE_TYPES => {
  if (typeof window === 'undefined') return 'DESKTOP';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.SM) return 'MOBILE';
  if (width < BREAKPOINTS.LG) return 'TABLET';
  return 'DESKTOP';
};

/**
 * 특정 브레이크포인트보다 작은지 확인
 */
export const isBelowBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS[breakpoint];
};

/**
 * 특정 브레이크포인트보다 큰지 확인
 */
export const isAboveBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * 모바일 디바이스인지 확인
 */
export const isMobile = (): boolean => {
  return getDeviceType() === 'MOBILE';
};

/**
 * 태블릿 디바이스인지 확인
 */
export const isTablet = (): boolean => {
  return getDeviceType() === 'TABLET';
};

/**
 * 데스크톱 디바이스인지 확인
 */
export const isDesktop = (): boolean => {
  return getDeviceType() === 'DESKTOP';
};

/**
 * 터치 디바이스인지 확인
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * 화면 방향이 세로인지 확인
 */
export const isPortrait = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.innerHeight > window.innerWidth;
};

/**
 * 화면 방향이 가로인지 확인
 */
export const isLandscape = (): boolean => {
  return !isPortrait();
};

/**
 * 반응형 테스트 결과를 콘솔에 출력
 */
export const logResponsiveInfo = (): void => {
  if (typeof window === 'undefined') return;
  
  const deviceType = getDeviceType();
  const isTouch = isTouchDevice();
  const orientation = isPortrait() ? 'portrait' : 'landscape';
  
  console.group('📱 Responsive Design Info');
  console.log(`Device Type: ${deviceType}`);
  console.log(`Screen Size: ${window.innerWidth}x${window.innerHeight}`);
  console.log(`Touch Device: ${isTouch}`);
  console.log(`Orientation: ${orientation}`);
  console.log(`Viewport: ${window.innerWidth}px`);
  console.groupEnd();
};

/**
 * 반응형 테스트를 위한 이벤트 리스너 등록
 */
export const setupResponsiveTest = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handleResize = () => {
    logResponsiveInfo();
  };
  
  const handleOrientationChange = () => {
    setTimeout(() => {
      logResponsiveInfo();
    }, 100);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // 초기 로그
  logResponsiveInfo();
  
  // 클린업 함수 반환
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

/**
 * 반응형 테스트를 위한 CSS 클래스 추가
 */
export const addResponsiveTestClasses = (): void => {
  if (typeof document === 'undefined') return;
  
  const deviceType = getDeviceType().toLowerCase();
  const isTouch = isTouchDevice();
  const orientation = isPortrait() ? 'portrait' : 'landscape';
  
  document.body.classList.add(
    `device-${deviceType}`,
    `orientation-${orientation}`,
    isTouch ? 'touch-device' : 'no-touch'
  );
};

/**
 * 반응형 테스트를 위한 CSS 클래스 제거
 */
export const removeResponsiveTestClasses = (): void => {
  if (typeof document === 'undefined') return;
  
  document.body.classList.remove(
    'device-mobile',
    'device-tablet',
    'device-desktop',
    'orientation-portrait',
    'orientation-landscape',
    'touch-device',
    'no-touch'
  );
};

/**
 * 반응형 테스트 초기화
 */
export const initResponsiveTest = (): (() => void) => {
  const cleanup = setupResponsiveTest();
  addResponsiveTestClasses();
  
  return () => {
    cleanup();
    removeResponsiveTestClasses();
  };
};

/**
 * 개발 환경에서만 반응형 테스트 활성화
 */
export const initResponsiveTestInDev = (): (() => void) | null => {
  if (process.env.NODE_ENV === 'development') {
    return initResponsiveTest();
  }
  return null;
};
