// 달러-원화 환율 (실제로는 API에서 가져와야 하지만, 임시로 고정값 사용)
let USD_TO_KRW_RATE = 1395; // 1 USD = 1395 KRW (실제 환율 기준)

// 환율 업데이트 함수 (실제 API 연동)
export const updateExchangeRate = async (): Promise<void> => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    if (data.rates && data.rates.KRW) {
      USD_TO_KRW_RATE = data.rates.KRW;
      console.log('✅ 환율 업데이트 완료: 1 USD =', USD_TO_KRW_RATE.toFixed(2), 'KRW');
    } else {
      console.warn('⚠️ 환율 데이터를 찾을 수 없습니다. 기본값 사용:', USD_TO_KRW_RATE);
    }
  } catch (error) {
    console.error('❌ 환율 업데이트 실패:', error);
    console.log('기본 환율 사용:', USD_TO_KRW_RATE);
  }
};

// 달러를 원화로 변환
export const convertUsdToKrw = (usdPrice: number): number => {
  return usdPrice * USD_TO_KRW_RATE;
};

// 현재 환율 반환
export const getCurrentExchangeRate = (): number => {
  return USD_TO_KRW_RATE;
};

// 숫자 포맷팅 유틸리티
export const formatPrice = (price: number, isUsd: boolean = true): string => {
  const finalPrice = isUsd ? convertUsdToKrw(price) : price;
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(finalPrice);
};

export const formatPercentage = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00%';
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

// 색상 유틸리티
export const getRiskColor = (level: number): string => {
  const colors = {
    1: '#10B981', // 초록 - 안전
    2: '#84CC16', // 연두 - 낮음
    3: '#F59E0B', // 주황 - 보통
    4: '#EF4444', // 빨강 - 높음
    5: '#DC2626'  // 진빨강 - 매우 높음
  };
  return colors[level as keyof typeof colors] || colors[3];
};

export const getRiskIcon = (level: number): string => {
  const icons = {
    1: '🛡️', // 방패
    2: '✅', // 체크
    3: '⚠️', // 경고
    4: '🚨', // 경보
    5: '💥'  // 폭발
  };
  return icons[level as keyof typeof icons] || icons[3];
};

export const getSignalColor = (action: string): string => {
  const colors = {
    BUY: '#10B981',   // 초록
    SELL: '#EF4444',  // 빨강
    HOLD: '#F59E0B',  // 주황
  };
  return colors[action as keyof typeof colors] || '#6B7280';
};

export const getSignalText = (action: string): string => {
  const texts = {
    BUY: '🟢 매수 신호!',
    SELL: '🔴 매도 신호!',
    HOLD: '🟡 관망 신호',
  };
  return texts[action as keyof typeof texts] || '⚪ 대기';
};

// 시간 유틸리티
export const formatTimeRemaining = (validUntil: string): string => {
  const now = new Date();
  const endTime = new Date(validUntil);
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return '만료됨';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  } else {
    return `${minutes}분 남음`;
  }
};

// 문자열 유틸리티
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 배열 유틸리티
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 로컬 스토리지 유틸리티
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

// 디바운스 유틸리티
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 쿠키 유틸리티
export const cookies = {
  get: (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },
  set: (name: string, value: string, days: number = 7): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },
  remove: (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
};
