import http from '@/utils/http'
export const listPage = (params: any, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/employee/listPage',
    method: 'get',
    params,
    cbs
  })
}
