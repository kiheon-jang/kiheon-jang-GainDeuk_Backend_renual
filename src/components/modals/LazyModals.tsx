import { lazy } from 'react';

// Lazy load modal components for better performance
export const CoinDetailModal = lazy(() => import('./CoinDetailModal'));
export const TradeExecutionModal = lazy(() => import('./TradeExecutionModal'));

// Preload modal components when user hovers over trigger elements
export const preloadCoinDetailModal = () => {
  import('./CoinDetailModal');
};

export const preloadTradeExecutionModal = () => {
  import('./TradeExecutionModal');
};
