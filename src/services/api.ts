import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { 
  DashboardData, 
  CoinRecommendation, 
  TradingSignal, 
  ApiTradingSignal,
  UserProfile, 
  Coin, 
  ApiResponse, 
  TradeExecution,
  InvestmentTest 
} from '@/types';

// API 클라이언트 클래스
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        // 요청 전 로깅
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 응답 성공 로깅
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        // 에러 처리
        console.error('[API Response Error]', error);
        
        if (error.response) {
          // 서버에서 응답을 받았지만 에러 상태
          const status = error.response.status;
          const message = this.getErrorMessage(status);
          console.error(`[API Error] ${status}: ${message}`);
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          console.error('[API Error] Network error - no response received');
        } else {
          // 요청 설정 중 에러
          console.error('[API Error] Request setup error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  private getErrorMessage(status: number): string {
    const errorMessages: Record<number, string> = {
      400: '잘못된 요청입니다.',
      401: '인증이 필요합니다.',
      403: '접근 권한이 없습니다.',
      404: '요청한 리소스를 찾을 수 없습니다.',
      500: '서버 내부 오류가 발생했습니다.',
      502: '게이트웨이 오류가 발생했습니다.',
      503: '서비스를 사용할 수 없습니다.',
    };
    
    return errorMessages[status] || '알 수 없는 오류가 발생했습니다.';
  }

  // 대시보드 데이터 조회 (signals와 coins를 조합하여 대시보드 데이터 구성)
  async getDashboardData(userId?: string): Promise<DashboardData> {
    try {
      // 백엔드에 dashboard 엔드포인트가 없으므로 signals와 coins를 조합
      const [signalsResponse, coinsResponse] = await Promise.all([
        this.client.get<ApiResponse<any[]>>('/signals', {
          params: { userId, limit: 10 }
        }),
        this.client.get<ApiResponse<any[]>>('/coins', {
          params: { limit: 20 }
        })
      ]);
      
      // 대시보드 데이터 구조로 변환
      const dashboardData: DashboardData = {
        recommendations: signalsResponse.data.data.map(signal => ({
          id: signal._id,
          coinId: signal.coinId,
          symbol: signal.symbol,
          name: signal.name,
          currentPrice: signal.currentPrice,
          recommendation: signal.recommendation.action,
          confidence: signal.recommendation.confidence,
          score: signal.finalScore,
          timeframe: signal.timeframe,
          priority: signal.priority,
          reason: `점수: ${signal.finalScore}, 신뢰도: ${signal.recommendation.confidence}`,
          createdAt: signal.createdAt
        })),
        tradingSignals: signalsResponse.data.data.map(signal => ({
          id: signal._id,
          coinId: signal.coinId,
          symbol: signal.symbol,
          name: signal.name,
          action: signal.recommendation.action,
          confidence: signal.recommendation.confidence,
          price: signal.currentPrice,
          timeframe: signal.timeframe,
          priority: signal.priority,
          score: signal.finalScore,
          createdAt: signal.createdAt
        })),
        marketOverview: {
          totalCoins: coinsResponse.data.pagination?.total || 0,
          totalSignals: signalsResponse.data.pagination?.total || 0,
          activeAlerts: 0, // alerts 엔드포인트에서 가져올 수 있음
          lastUpdated: new Date().toISOString()
        }
      };
      
      return dashboardData;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // AI 추천 코인 조회 (signals 엔드포인트를 사용)
  async getRecommendations(userId?: string): Promise<CoinRecommendation[]> {
    try {
      const response = await this.client.get<ApiResponse<any[]>>('/signals', {
        params: { userId, limit: 50 }
      });
      
      // signals 데이터를 CoinRecommendation 형태로 변환
      return response.data.data.map(signal => ({
        id: signal._id,
        coinId: signal.coinId,
        symbol: signal.symbol,
        name: signal.name,
        currentPrice: signal.currentPrice,
        recommendation: signal.recommendation.action,
        confidence: signal.recommendation.confidence,
        score: signal.finalScore,
        timeframe: signal.timeframe,
        priority: signal.priority,
        reason: `점수: ${signal.finalScore}, 신뢰도: ${signal.recommendation.confidence}`,
        createdAt: signal.createdAt
      }));
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }

  // 실시간 매매 신호 조회 (signals 엔드포인트 사용)
  async getTradingSignals(userId?: string, strategy?: string): Promise<ApiTradingSignal[]> {
    try {
      const response = await this.client.get<ApiResponse<any[]>>('/signals', {
        params: { userId, strategy, limit: 50 }
      });
      
      // signals 데이터를 TradingSignal 형태로 변환
      return response.data.data.map(signal => ({
        id: signal._id,
        coinId: signal.coinId,
        symbol: signal.symbol,
        name: signal.name,
        action: signal.recommendation.action,
        confidence: signal.recommendation.confidence,
        price: signal.currentPrice,
        timeframe: signal.timeframe,
        priority: signal.priority,
        score: signal.finalScore,
        createdAt: signal.createdAt,
        // 추가 필드들 매핑
        finalScore: signal.finalScore,
        breakdown: signal.breakdown,
        recommendation: signal.recommendation,
        metadata: signal.metadata,
        marketCap: signal.marketCap,
        rank: signal.rank,
        updatedAt: signal.updatedAt
      }));
    } catch (error) {
      console.error('Failed to fetch trading signals:', error);
      throw error;
    }
  }

  // 매매 신호 상세 정보 조회 (signals 엔드포인트 사용)
  async getTradingSignalDetail(signalId: string): Promise<TradingSignal> {
    try {
      const response = await this.client.get<ApiResponse<any>>(`/signals/${signalId}`);
      
      // signal 데이터를 TradingSignal 형태로 변환
      const signal = response.data.data;
      return {
        id: signal._id,
        coin: {
          id: signal.coinId,
          symbol: signal.symbol,
          name: signal.name,
          currentPrice: signal.currentPrice,
          change24h: signal.metadata?.priceData?.change_24h || 0,
          image: '',
        },
        signal: {
          action: signal.recommendation.action,
          strength: signal.recommendation.confidence === 'HIGH' ? 'STRONG' : 'MEDIUM',
          confidence: signal.finalScore,
        },
        targets: {
          entryPrice: signal.currentPrice,
          targetPrice: signal.currentPrice * 1.1,
          stopLoss: signal.currentPrice * 0.95,
          takeProfit: signal.currentPrice * 1.2,
          positionSize: 100000,
          positionSizePercentage: 10,
          maxRiskAmount: 5000,
        },
        timeframe: {
          strategy: 'DAY_TRADING',
          duration: signal.timeframe,
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        reasons: {
          technical: [`점수: ${signal.finalScore}/100`],
          fundamental: [`우선순위: ${signal.priority}`],
          sentiment: [],
          news: [],
        },
        checklist: [
          { id: '1', text: '시장 상황 확인', completed: false },
          { id: '2', text: '리스크 관리', completed: false },
          { id: '3', text: '포지션 크기 결정', completed: false },
        ],
        riskLevel: 3,
        expectedReturn: 10,
        maxLoss: 5,
      };
    } catch (error) {
      console.error('Failed to fetch trading signal detail:', error);
      throw error;
    }
  }

  // 매매 실행 (현재 백엔드에 구현되지 않음 - 임시 구현)
  async executeTrade(tradeData: {
    signalId: string;
    action: 'BUY' | 'SELL';
    amount: number;
    price: number;
  }): Promise<TradeExecution> {
    try {
      // 백엔드에 trading/execute 엔드포인트가 없으므로 임시로 시뮬레이션
      console.warn('매매 실행 기능은 백엔드에 구현되지 않았습니다. 시뮬레이션 모드로 실행됩니다.');
      
      const mockExecution: TradeExecution = {
        id: `trade_${Date.now()}`,
        signalId: tradeData.signalId,
        action: tradeData.action,
        amount: tradeData.amount,
        price: tradeData.price,
        status: 'PENDING',
        executedAt: new Date().toISOString(),
        message: '매매 실행이 요청되었습니다. (시뮬레이션 모드)'
      };
      
      return mockExecution;
    } catch (error) {
      console.error('Failed to execute trade:', error);
      throw error;
    }
  }

  // 사용자 성향 분석 (user-profiles 엔드포인트 사용)
  async analyzeUserProfile(testAnswers: any[]): Promise<UserProfile> {
    try {
      // 백엔드의 user-profiles 엔드포인트를 사용하여 프로필 생성
      const response = await this.client.post<ApiResponse<UserProfile>>('/user-profiles', {
        answers: testAnswers,
        riskTolerance: 'MEDIUM', // 기본값
        investmentGoal: 'GROWTH', // 기본값
        timeHorizon: 'LONG_TERM' // 기본값
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to analyze user profile:', error);
      throw error;
    }
  }


  // 코인 상세 정보 조회
  async getCoinDetails(coinId: string): Promise<Coin> {
    try {
      const response = await this.client.get<ApiResponse<Coin>>(`/coins/${coinId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch coin details:', error);
      throw error;
    }
  }

  // 투자 성향 테스트 질문 조회 (임시 구현)
  async getInvestmentTest(): Promise<InvestmentTest> {
    try {
      // 백엔드에 investment-test 엔드포인트가 없으므로 임시로 하드코딩된 질문 반환
      const mockTest: InvestmentTest = {
        id: 'investment_test_1',
        title: '투자 성향 테스트',
        description: '당신의 투자 성향을 파악하기 위한 질문입니다.',
        questions: [
          {
            id: 'q1',
            question: '투자 목표는 무엇인가요?',
            options: [
              { id: 'a1', text: '안정적인 수익', value: 'CONSERVATIVE' },
              { id: 'a2', text: '적당한 성장', value: 'MODERATE' },
              { id: 'a3', text: '높은 수익', value: 'AGGRESSIVE' }
            ]
          },
          {
            id: 'q2',
            question: '투자 기간은 얼마나 되나요?',
            options: [
              { id: 'b1', text: '1년 이하', value: 'SHORT_TERM' },
              { id: 'b2', text: '1-3년', value: 'MEDIUM_TERM' },
              { id: 'b3', text: '3년 이상', value: 'LONG_TERM' }
            ]
          }
        ]
      };
      
      return mockTest;
    } catch (error) {
      console.error('Failed to fetch investment test:', error);
      throw error;
    }
  }

  // 사용자 프로필 저장 (user-profiles 엔드포인트 사용)
  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const response = await this.client.post<ApiResponse<UserProfile>>('/user-profiles', profile);
      return response.data.data;
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  // 사용자 프로필 조회 (user-profiles 엔드포인트 사용)
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.client.get<ApiResponse<UserProfile>>(`/user-profiles/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  // 코인 목록 조회
  async getCoins(
    searchQuery?: string, 
    sortBy?: string, 
    sortOrder?: 'asc' | 'desc', 
    filterBy?: string
  ): Promise<Coin[]> {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (filterBy) params.append('filter', filterBy);
      
      const response = await this.client.get<ApiResponse<Coin[]>>(`/coins?${params.toString()}&limit=100`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch coins:', error);
      throw error;
    }
  }

  // 서버 상태 확인
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.client.get<ApiResponse<{ status: string; timestamp: string }>>('/health');
      return response.data.data;
    } catch (error) {
      console.error('Failed to check server health:', error);
      throw error;
    }
  }

  // 백테스팅 실행
  async runBacktest(startDate: string, endDate: string, initialCapital: number = 10000): Promise<any> {
    try {
      const response = await this.client.post<ApiResponse<any>>('/signals/backtest', {
        startDate,
        endDate,
        initialCapital
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to run backtest:', error);
      throw error;
    }
  }

  // 성과 리포트 조회
  async getPerformanceReport(): Promise<any> {
    try {
      const response = await this.client.get<ApiResponse<any>>('/signals/performance-report');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch performance report:', error);
      throw error;
    }
  }

  // 중복 신호 정리
  async cleanupDuplicateSignals(coinId?: string): Promise<any> {
    try {
      const params = coinId ? { coinId } : {};
      const response = await this.client.post<ApiResponse<any>>('/signals/cleanup-duplicates', null, { params });
      return response.data.data;
    } catch (error) {
      console.error('Failed to cleanup duplicate signals:', error);
      throw error;
    }
  }

  // 뉴스 수집 및 감정분석 수동 실행
  async collectNews(): Promise<any> {
    try {
      const response = await this.client.post<ApiResponse<any>>('/news/collect');
      return response.data.data;
    } catch (error) {
      console.error('Failed to collect news:', error);
      throw error;
    }
  }

  // 소셜미디어 모니터링 시작
  async startSocialMediaMonitoring(): Promise<any> {
    try {
      const response = await this.client.post<ApiResponse<any>>('/social-media/start');
      return response.data.data;
    } catch (error) {
      console.error('Failed to start social media monitoring:', error);
      throw error;
    }
  }

  // 소셜미디어 모니터링 중지
  async stopSocialMediaMonitoring(): Promise<any> {
    try {
      const response = await this.client.post<ApiResponse<any>>('/social-media/stop');
      return response.data.data;
    } catch (error) {
      console.error('Failed to stop social media monitoring:', error);
      throw error;
    }
  }

  // 소셜미디어 데이터 조회
  async getSocialMediaData(): Promise<any> {
    try {
      const response = await this.client.get<ApiResponse<any>>('/social-media/data');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch social media data:', error);
      throw error;
    }
  }

  // 뉴스 데이터 조회
  async getNewsData(limit: number = 20): Promise<any> {
    try {
      const response = await this.client.get<ApiResponse<any>>('/news', {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch news data:', error);
      throw error;
    }
  }

  // 시그널 데이터 대시보드용 데이터 조회
  async getSignalDashboardData(): Promise<any> {
    try {
      // 여러 API를 병렬로 호출하여 시그널 계산에 사용되는 데이터들을 수집
      const [
        signalsResponse,
        coinsResponse,
        newsResponse,
        socialMediaResponse
      ] = await Promise.allSettled([
        this.client.get<ApiResponse<any[]>>('/signals', { params: { limit: 10 } }),
        this.client.get<ApiResponse<any[]>>('/coins', { params: { limit: 1 } }),
        this.client.get<ApiResponse<any>>('/news', { params: { limit: 5 } }),
        this.client.get<ApiResponse<any>>('/social-media/data')
      ]);

      // 응답 데이터 처리
      const signals = signalsResponse.status === 'fulfilled' ? signalsResponse.value.data.data : [];
      const coins = coinsResponse.status === 'fulfilled' ? coinsResponse.value.data.data : [];
      const news = newsResponse.status === 'fulfilled' ? newsResponse.value.data.data : null;
      const socialMedia = socialMediaResponse.status === 'fulfilled' ? socialMediaResponse.value.data.data : null;

      console.log('API Responses:', {
        signals: signals.length,
        coins: coins.length,
        news,
        socialMedia
      });

      // 첫 번째 코인 데이터 (BTC) 사용
      const btcData = coins[0] || {
        currentPrice: 43250.50,
        priceChange: { '1h': 1.25, '24h': -2.15, '7d': 8.75, '30d': 15.30 },
        marketCap: 850000000000,
        totalVolume: 25000000000,
        marketCapRank: 1
      };

      // 시그널 데이터에서 breakdown 정보 추출
      const signalBreakdown = signals[0]?.breakdown || {
        price: 65,
        volume: 70,
        market: 60,
        sentiment: 72,
        whale: 75
      };

      // 시그널 메타데이터에서 추가 정보 추출
      const signalMetadata = signals[0]?.metadata || {};

      // 대시보드 데이터 구성
      const dashboardData = {
        priceData: {
          current: btcData.currentPrice,
          change1h: btcData.priceChange?.['1h'] || 0,
          change24h: btcData.priceChange?.['24h'] || 0,
          change7d: btcData.priceChange?.['7d'] || 0,
          change30d: btcData.priceChange?.['30d'] || 0
        },
        volumeData: {
          ratio: signalMetadata.volumeRatio || 2.3,
          change24h: 45.2, // 실제로는 계산 필요
          average: 1.8
        },
        marketData: {
          dominance: signalMetadata.correlation?.marketDominance || 42.5,
          phase: signalMetadata.correlation?.altcoinSeason ? 'ALTCOIN_SEASON' : 'BTC_DOMINANT',
          totalMarketCap: btcData.marketCap || 1650000000000
        },
        sentimentData: {
          fearGreedIndex: signalMetadata.correlation?.fearGreedIndex || 65,
          sentiment: this.getSentimentFromIndex(signalMetadata.correlation?.fearGreedIndex || 65),
          newsSentiment: signalBreakdown.sentiment,
          socialSentiment: 68
        },
        whaleData: {
          activityScore: signalBreakdown.whale,
          largeTransactions: 12,
          totalVolume: '$2.4B',
          averageTransactionSize: '$200K'
        },
        technicalData: {
          volatility: signalMetadata.volatility || 18.5,
          rsi: 58,
          macd: 0.15,
          bollinger: 0.85
        },
        lastUpdated: new Date().toISOString(),
        newsItems: [] // news API 응답 구조가 다르므로 빈 배열로 설정
      };

      return dashboardData;
    } catch (error) {
      console.error('Failed to fetch signal dashboard data:', error);
      throw error;
    }
  }

  // 공포탐욕지수에서 감정 상태 추출
  private getSentimentFromIndex(index: number): 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed' {
    if (index >= 75) return 'extreme_greed';
    if (index >= 55) return 'greed';
    if (index >= 45) return 'neutral';
    if (index >= 25) return 'fear';
    return 'extreme_fear';
  }

}

// API 클라이언트 인스턴스 생성 및 내보내기
export const apiClient = new ApiClient();

// 개별 함수들도 내보내기 (편의성을 위해)
export const api = {
  getDashboardData: (userId?: string) => apiClient.getDashboardData(userId),
  getRecommendations: (userId?: string) => apiClient.getRecommendations(userId),
  getTradingSignals: (userId?: string, strategy?: string) => apiClient.getTradingSignals(userId, strategy),
  getTradingSignalDetail: (signalId: string) => apiClient.getTradingSignalDetail(signalId),
  executeTrade: (tradeData: { signalId: string; action: 'BUY' | 'SELL'; amount: number; price: number }) => 
    apiClient.executeTrade(tradeData),
  analyzeUserProfile: (testAnswers: any[]) => apiClient.analyzeUserProfile(testAnswers),
  getCoins: (searchQuery?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', filterBy?: string) => 
    apiClient.getCoins(searchQuery, sortBy, sortOrder, filterBy),
  getCoinDetails: (coinId: string) => apiClient.getCoinDetails(coinId),
  getInvestmentTest: () => apiClient.getInvestmentTest(),
  saveUserProfile: (profile: UserProfile) => apiClient.saveUserProfile(profile),
  getUserProfile: (userId: string) => apiClient.getUserProfile(userId),
  healthCheck: () => apiClient.healthCheck(),
  // 새로운 백엔드 기능들
  runBacktest: (startDate: string, endDate: string, initialCapital?: number) => 
    apiClient.runBacktest(startDate, endDate, initialCapital),
  getPerformanceReport: () => apiClient.getPerformanceReport(),
  cleanupDuplicateSignals: (coinId?: string) => apiClient.cleanupDuplicateSignals(coinId),
  collectNews: () => apiClient.collectNews(),
  startSocialMediaMonitoring: () => apiClient.startSocialMediaMonitoring(),
  stopSocialMediaMonitoring: () => apiClient.stopSocialMediaMonitoring(),
  getSocialMediaData: () => apiClient.getSocialMediaData(),
  getNewsData: (limit?: number) => apiClient.getNewsData(limit),
  getSignalDashboardData: () => apiClient.getSignalDashboardData(),
};

export default apiClient;
