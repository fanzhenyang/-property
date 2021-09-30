import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    cbs?: () => void
  }

  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
} 