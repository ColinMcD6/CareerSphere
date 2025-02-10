import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './config/queryClient.ts'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import theme from './theme/theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
      <ReactQueryDevtools position='bottom' initialIsOpen={false} />
    </BrowserRouter>
    </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
)
