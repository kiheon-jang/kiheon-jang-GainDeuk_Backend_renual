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
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: string;
  score: number;
  timeframe: string;
  priority: string;
  reason: string;
  createdAt: string;
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
  riskText?: string; // 위험도 텍스트
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
  recommendations: CoinRecommendation[];
  tradingSignals: ApiTradingSignal[];
  marketOverview: {
    totalCoins: number;
    totalSignals: number;
    activeAlerts: number;
    lastUpdated: string;
  };
}

// 투자 성향 테스트 관련 타입
export interface InvestmentTest {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: {
      id: string;
      text: string;
      value: string;
    }[];
  }[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
  // 추가 필드들
  finalScore?: number;
  breakdown?: {
    price: number;
    volume: number;
    market: number;
    sentiment: number;
    whale: number;
  };
  recommendation?: {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: string;
  };
  metadata?: {
    priceData?: {
      change_1h: number;
      change_24h: number;
      change_7d: number;
      change_30d: number;
    };
    volumeRatio?: number;
    whaleActivity?: number;
    newsCount?: number;
    lastUpdated?: string;
    calculationTime?: number;
    dataQuality?: string;
  };
  marketCap?: number;
  rank?: number;
  updatedAt?: string;
}

// 매매 실행 타입
export interface TradeExecution {
  id: string;
  signalId: string;
  action: 'BUY' | 'SELL';
  amount: number;
  price: number;
  status: string;
  executedAt: string;
  message: string;
}

// 백테스팅 관련 타입
export interface BacktestResult {
  trades: Trade[];
  performance: PerformanceMetrics;
  summary: BacktestSummary;
}

export interface Trade {
  type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  shares: number;
  amount: number;
  profit?: number;
  timestamp: string;
}

export interface PerformanceMetrics {
  totalSignals: number;
  successfulSignals: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
}

export interface BacktestSummary {
  totalTrades: number;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  maxDrawdown: number;
}

// 성과 리포트 타입
export interface PerformanceReport {
  timestamp: string;
  metrics: {
    [timeframe: string]: {
      target: number;
      current: number;
      samples: number;
      status: 'GOOD' | 'NEEDS_IMPROVEMENT';
    };
  };
  recommendations: {
    timeframe: string;
    issue: string;
    suggestion: string;
  }[];
}

// 뉴스 데이터 타입
export interface NewsData {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: {
    score: number;
    label: string;
    confidence: number;
  };
  sentimentProcessed: boolean;
  sentimentProcessedAt?: string;
  sentimentRetryCount: number;
  createdAt: string;
  updatedAt: string;
}

// 소셜미디어 데이터 타입
export interface SocialMediaData {
  platform: 'twitter' | 'telegram';
  data: SocialMediaPost[];
  timestamp: string;
  count: number;
  error?: string;
}

export interface SocialMediaPost {
  id: string;
  text: string;
  author: string;
  platform: 'twitter' | 'telegram';
  timestamp: string;
  metrics: {
    retweets?: number;
    likes?: number;
    replies?: number;
  };
  sentiment: {
    score: number;
    label: string;
  };
  relevance: number;
  keywords: string[];
}
