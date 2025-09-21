// 코인 관련 타입
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  image: string;
  marketCap?: number;
  volume?: number;
}

// AI 추천 관련 타입
export interface CoinRecommendation {
  coin: Coin;
  expectedReturn: number;        // 예상 수익률 (%)
  riskLevel: 1 | 2 | 3 | 4 | 5; // 위험도 (1=안전, 5=위험)
  reasons: string[];             // 추천 이유 (3-5개)
  confidence: number;            // AI 신뢰도 (0-100)
  timeframe: string;             // 추천 기간
}

// 매매 신호 관련 타입
export interface TradingSignal {
  id: string;
  coin: Coin;
  signal: {
    action: 'BUY' | 'SELL' | 'HOLD';
    strength: 'STRONG' | 'MEDIUM' | 'WEAK';
    confidence: number; // 0-100
  };
  targets: {
    entryPrice: number;
    targetPrice: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;        // AI가 계산한 포지션 크기 (원화 기준)
    positionSizePercentage: number; // 자본금 대비 포지션 비율 (%)
    maxRiskAmount: number;       // 최대 손실 가능 금액
  };
  timeframe: {
    strategy: 'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'LONG_TERM';
    duration: string; // "2시간 30분", "3-5일" 등
    validUntil: string;
  };
  reasons: {
    technical: string[];
    fundamental: string[];
    sentiment: string[];
    news: string[];              // 뉴스 기반 이유
  };
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  riskLevel: 1 | 2 | 3 | 4 | 5;
  expectedReturn: number; // 퍼센트
  maxLoss: number; // 퍼센트
}

// 사용자 프로필 관련 타입
export interface UserProfile {
  id: string;
  investmentStyle: 'conservative' | 'moderate' | 'aggressive';
  riskTolerance: number;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedStrategy: string;
  preferences: {
    notifications: boolean;
    language: 'ko' | 'en';
    theme: 'light' | 'dark';
  };
}

// 대시보드 데이터 타입
export interface DashboardData {
  aiRecommendations: CoinRecommendation[];
  userProfile: UserProfile;
  marketSummary: {
    totalMarketCap: string;
    marketTrend: 'up' | 'down' | 'sideways';
    trendDescription: string;
  };
}

// 투자 성향 테스트 관련 타입
export interface InvestmentTest {
  questions: {
    id: number;
    question: string;
    options: {
      text: string;
      score: {
        conservative: number;
        moderate: number;
        aggressive: number;
      };
    }[];
  }[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API에서 반환하는 실제 매매 신호 타입 (백엔드 signals 엔드포인트)
export interface ApiTradingSignal {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: string;
  price: number;
  timeframe: string;
  priority: string;
  score: number;
  createdAt: string;
}

// 매매 실행 타입
export interface TradeExecution {
  signalId: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: string;
}
