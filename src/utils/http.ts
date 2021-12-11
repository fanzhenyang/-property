'use strict'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// import config from './config'
import session from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { routes, router } from '@/router/index'
import store from '@/store/index'
// import router from '@/router'
class Http {
  private readonly baseUrl: string | undefined

  constructor() {
    // this.baseUrl = config.hostUrl
    this.baseUrl = process.env.VUE_APP_BASE_API
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 50000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }
    return config
  }

  // 请求拦截
  interceptors(instance: AxiosInstance, url: string | number | undefined) {
    instance.interceptors.request.use(config => {
      // 添加全局的loading..
      // 请求头携带token
      config.headers.Authorization = 'Bearer ' + session.getItem('ADMIN_TOKEN')
      return config
    }, (error: unknown) => {
      return Promise.reject(error)
    })

    // 响应拦截
    instance.interceptors.response.use((res: AxiosResponse) => {
      res.config.cbs && res.config.cbs()
      // 返回数据
      const { data, config, status } = res
      if (data.data?.current && data.data?.size && data.data?.total) {
        const { data: { current, size, total } } = data
        data.data.paginationPage = Object.assign({}, { page: current, size: size, total: total })
      }
      if (config.url && config.url.includes('auth/oauth/token')) {
        if (data.status === 412) {
          ElMessage.error(data.message)
          return false
        } else {
          ElMessage.success('登录成功')
        }
      }
      if (data.status === 401) {
        ElMessage.error(data.message)
        store.dispatch('user/resetToken').then(res => {
          router.push({ path: '/login' })
        })
        return false
      }
      if (data.status === 412) {
        ElMessage.error(data.message)
        return false
      }

      if (res.config.msg && document.getElementsByClassName('el-message').length === 0) {
        if (res.config.type === 'add') {
          Http.msgFunc(data, '新增')
        } else if (res.config.type === 'edit') {
          Http.msgFunc(data, '编辑')
        } else if (res.config.type === 'reset') {
          Http.msgFunc(data, '重置密码')
        } else if (res.config.type === 'delete') {
          Http.msgFunc(data, '删除')
        } else {
          Http.msgFunc(data)
        }
      }

      return Object.assign({}, data, status)
    }, (error: any) => {
      error.config.cbs && error.config.cbs()
      return Promise.reject(error)
    })
  }

  request(options: AxiosRequestConfig) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }

  static msgFunc(data: any, str = '') {
    if (data.status === 200) {
      ElMessage.success(str + data.message)
    } else if (data.status === 412) {
      ElMessage.error(data.message)
    } else {
      ElMessage.error(str + data.message)
    }
  }
}

const http = new Http()
export default http
