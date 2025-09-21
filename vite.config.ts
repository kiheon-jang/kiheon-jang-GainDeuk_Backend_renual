import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 플러그인 설정
    }),
    // Bundle analyzer for production builds
    process.env.ANALYZE === 'true' && visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
        // HTML 변환 플러그인 (개발 모드용)
        {
          name: 'html-transform',
          transformIndexHtml(html) {
            // 불필요한 preload 링크 제거 (더 포괄적으로)
            return html
              .replace(
                /<link[^>]*rel="preload"[^>]*href="[^"]*\/(fonts\/noto-sans-kr\.woff2|images\/logo\.webp|api\/coins)"[^>]*>/gi,
                ''
              )
              .replace(
                /<link[^>]*rel="preload"[^>]*href="[^"]*\/fonts\/[^"]*"[^>]*>/gi,
                ''
              )
              .replace(
                /<link[^>]*rel="preload"[^>]*href="[^"]*\/images\/[^"]*"[^>]*>/gi,
                ''
              )
              .replace(
                /<link[^>]*rel="preload"[^>]*href="[^"]*\/api\/[^"]*"[^>]*>/gi,
                ''
              );
          }
        }
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/constants': path.resolve(__dirname, './src/constants'),
    },
  },
  // 의존성 최적화
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'styled-components',
      'lucide-react'
    ],
    exclude: [
      // 불필요한 의존성 제외
    ]
  },
  // 개발 서버 설정
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  // 빌드 설정
  build: {
    // Preload 최적화 설정
    rollupOptions: {
      // Preload 제어를 위한 HTML 플러그인 설정
      plugins: [
        {
          name: 'preload-control',
          generateBundle(options, bundle) {
            // 불필요한 preload 제거
            Object.keys(bundle).forEach(fileName => {
              if (fileName.endsWith('.html')) {
                const html = bundle[fileName];
                if (html && html.type === 'asset') {
                  let content = html.source;
                  if (typeof content === 'string') {
                    // 불필요한 preload 링크 제거 (더 포괄적으로)
                    content = content
                      .replace(
                        /<link[^>]*rel="preload"[^>]*href="[^"]*\/(fonts\/noto-sans-kr\.woff2|images\/logo\.webp|api\/coins)"[^>]*>/gi,
                        ''
                      )
                      .replace(
                        /<link[^>]*rel="preload"[^>]*href="[^"]*\/fonts\/[^"]*"[^>]*>/gi,
                        ''
                      )
                      .replace(
                        /<link[^>]*rel="preload"[^>]*href="[^"]*\/images\/[^"]*"[^>]*>/gi,
                        ''
                      )
                      .replace(
                        /<link[^>]*rel="preload"[^>]*href="[^"]*\/api\/[^"]*"[^>]*>/gi,
                        ''
                      );
                    html.source = content;
                  }
                }
              }
            });
          }
        }
      ],
      output: {
        manualChunks: (id) => {
          // Vendor chunks - 더 세분화된 청크 분할
          if (id.includes('node_modules')) {
            // React 관련
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // 라우터
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            // 상태 관리
            if (id.includes('@tanstack/react-query') || id.includes('zustand')) {
              return 'state-vendor';
            }
            // UI 라이브러리
            if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
              return 'ui-vendor';
            }
            // 스타일링
            if (id.includes('styled-components') || id.includes('emotion')) {
              return 'styled-vendor';
            }
            // 차트 및 시각화
            if (id.includes('chart') || id.includes('d3') || id.includes('recharts')) {
              return 'chart-vendor';
            }
            // 기타 vendor
            return 'vendor';
          }
          
          // Feature chunks - 기능별 청크 분할
          if (id.includes('src/')) {
            // 페이지별 청크
            if (id.includes('src/pages/')) {
              const pageName = id.split('src/pages/')[1].split('/')[0];
              return `page-${pageName}`;
            }
            // 컴포넌트별 청크
            if (id.includes('src/components/')) {
              const componentType = id.split('src/components/')[1].split('/')[0];
              return `component-${componentType}`;
            }
            // 유틸리티 청크
            if (id.includes('src/utils/')) {
              return 'utils';
            }
            // 훅 청크
            if (id.includes('src/hooks/')) {
              return 'hooks';
            }
            // 서비스 청크
            if (id.includes('src/services/')) {
              return 'services';
            }
          }
        },
        // 청크 파일명 최적화
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'images/[name]-[hash][extname]';
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return 'fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // 최적화 설정
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : []
      },
      mangle: {
        safari10: true
      }
    },
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000,
    // 소스맵 설정
    sourcemap: process.env.NODE_ENV === 'development',
    // CSS 코드 분할
    cssCodeSplit: true,
    // 에셋 인라인 임계값
    assetsInlineLimit: 4096
  },
  // 미리보기 서버 설정
  preview: {
    port: 4173,
    open: true
  }
})