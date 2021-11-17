import { AxiosRequestConfig } from 'axios'

import 'vue'

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

declare module 'vue' {
  interface HTMLAttributes {
    // vLoading?: unknown
    [x: string]: any
  }
  interface HTMLElement {
    [x: string]: any
  }
}
