import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { 
  DashboardData, 
  CoinRecommendation, 
  TradingSignal, 
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

  // 대시보드 데이터 조회
  async getDashboardData(userId?: string): Promise<DashboardData> {
    try {
      const response = await this.client.get<ApiResponse<DashboardData>>('/dashboard', {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  // AI 추천 코인 조회
  async getRecommendations(userId?: string): Promise<CoinRecommendation[]> {
    try {
      const response = await this.client.get<ApiResponse<CoinRecommendation[]>>('/recommendations', {
        params: { userId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }

  // 실시간 매매 신호 조회
  async getTradingSignals(userId?: string, strategy?: string): Promise<TradingSignal[]> {
    try {
      const response = await this.client.get<ApiResponse<TradingSignal[]>>('/trading/signals', {
        params: { userId, strategy }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch trading signals:', error);
      throw error;
    }
  }

  // 매매 신호 상세 정보 조회
  async getTradingSignalDetail(signalId: string): Promise<TradingSignal> {
    try {
      const response = await this.client.get<ApiResponse<TradingSignal>>(`/trading/signals/${signalId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch trading signal detail:', error);
      throw error;
    }
  }

  // 매매 실행
  async executeTrade(tradeData: {
    signalId: string;
    action: 'BUY' | 'SELL';
    amount: number;
    price: number;
  }): Promise<TradeExecution> {
    try {
      const response = await this.client.post<ApiResponse<TradeExecution>>('/trading/execute', tradeData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to execute trade:', error);
      throw error;
    }
  }

  // 사용자 성향 분석
  async analyzeUserProfile(testAnswers: any[]): Promise<UserProfile> {
    try {
      const response = await this.client.post<ApiResponse<UserProfile>>('/analyze-profile', {
        answers: testAnswers
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to analyze user profile:', error);
      throw error;
    }
  }

  // 코인 목록 조회
  async getCoins(search?: string, limit?: number): Promise<Coin[]> {
    try {
      const response = await this.client.get<ApiResponse<Coin[]>>('/coins', {
        params: { search, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch coins:', error);
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

  // 투자 성향 테스트 질문 조회
  async getInvestmentTest(): Promise<InvestmentTest> {
    try {
      const response = await this.client.get<ApiResponse<InvestmentTest>>('/investment-test');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch investment test:', error);
      throw error;
    }
  }

  // 사용자 프로필 저장
  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    try {
      const response = await this.client.post<ApiResponse<UserProfile>>('/user-profile', profile);
      return response.data.data;
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }

  // 사용자 프로필 조회
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.client.get<ApiResponse<UserProfile>>(`/user-profile/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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
  getCoins: (search?: string, limit?: number) => apiClient.getCoins(search, limit),
  getCoinDetails: (coinId: string) => apiClient.getCoinDetails(coinId),
  getInvestmentTest: () => apiClient.getInvestmentTest(),
  saveUserProfile: (profile: UserProfile) => apiClient.saveUserProfile(profile),
  getUserProfile: (userId: string) => apiClient.getUserProfile(userId),
  healthCheck: () => apiClient.healthCheck(),
};

export default apiClient;
