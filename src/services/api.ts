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
        createdAt: signal.createdAt
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
};

export default apiClient;
