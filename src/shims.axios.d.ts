import { AxiosRequestConfig } from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    cbs?: () => void,
    msg?: boolean,
    type?: string
  }

  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}
