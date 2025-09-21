/**
 * 이미지 로딩 유틸리티 함수들
 * 외부 이미지 로딩 문제를 해결하기 위해 아이콘 기반 시스템으로 대체
 */

/**
 * 암호화폐 심볼에 따른 아이콘 반환
 * 외부 이미지 대신 아이콘을 사용하여 안정성 확보
 */
export const getCoinIcon = (symbol: string): string => {
  // 주요 암호화폐들의 아이콘 매핑
  const coinIcons: Record<string, string> = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': 'B',
    'ADA': '₳',
    'SOL': '◎',
    'XRP': '✕',
    'DOT': '●',
    'DOGE': 'Ð',
    'AVAX': '🔺',
    'MATIC': '⬟',
    'LINK': '🔗',
    'UNI': '🦄',
    'LTC': 'Ł',
    'ATOM': '⚛',
    'NEAR': '⧉',
    'FTM': '♠',
    'ALGO': '◊',
    'VET': 'V',
    'ICP': '∞',
    'FIL': '⧖'
  };

  return coinIcons[symbol.toUpperCase()] || '₿'; // 기본값은 비트코인 아이콘
};

/**
 * 암호화폐 색상 반환
 */
export const getCoinColor = (symbol: string): string => {
  const coinColors: Record<string, string> = {
    'BTC': '#F7931A',
    'ETH': '#627EEA',
    'BNB': '#F3BA2F',
    'ADA': '#0033AD',
    'SOL': '#9945FF',
    'XRP': '#23292F',
    'DOT': '#E6007A',
    'DOGE': '#C2A633',
    'AVAX': '#E84142',
    'MATIC': '#8247E5',
    'LINK': '#2A5ADA',
    'UNI': '#FF007A',
    'LTC': '#BFBBBB',
    'ATOM': '#2E3148',
    'NEAR': '#000000',
    'FTM': '#1969FF',
    'ALGO': '#000000',
    'VET': '#15BDBD',
    'ICP': '#29ABE2',
    'FIL': '#0090FF'
  };

  return coinColors[symbol.toUpperCase()] || '#6B7280'; // 기본값은 회색
};

/**
 * 이미지 로딩 전략 (아이콘 기반으로 변경)
 */
export const loadImageWithFallback = async (symbol: string): Promise<string> => {
  // 외부 이미지 대신 아이콘 사용
  return 'icon'; // 아이콘 사용을 나타내는 플래그
};

/**
 * 이미지 프리로딩 (더 이상 필요하지 않음)
 */
export const preloadImage = (url: string): Promise<void> => {
  return Promise.resolve(); // 아이콘은 프리로딩이 불필요
};
