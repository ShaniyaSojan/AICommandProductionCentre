import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntApp, theme } from 'antd'
import App from './App'
import './index.css'

const { darkAlgorithm } = theme

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            algorithm: darkAlgorithm,
            token: {
              colorPrimary: '#6c47ff',
              colorBgBase: '#090e1a',
              colorBgContainer: '#111827',
              colorBgElevated: '#1a2540',
              colorBorder: '#1e2d4a',
              borderRadius: 8,
            },
            components: {
              Layout: {
                siderBg: '#07091a',
                headerBg: '#0b1120',
                bodyBg: '#090e1a',
              },
              Menu: {
                itemBg: 'transparent',
                itemActiveBg: 'rgba(108, 71, 255, 0.2)',
                itemSelectedBg: 'rgba(108, 71, 255, 0.3)',
                itemSelectedColor: '#ffffff',
                itemColor: '#9ca3af',
                itemHoverColor: '#ffffff',
                itemHoverBg: 'rgba(108, 71, 255, 0.1)',
              },
              Table: {
                headerBg: '#0f1729',
                rowHoverBg: 'rgba(108, 71, 255, 0.05)',
                borderColor: '#1e2d4a',
              },
            },
          }}
        >
          <AntApp>
            <App />
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
