import http from '@/utils/http'
// 获取按钮的分类
export const listByTree = (params: null, cbs?: () => void): Promise<any> => {
  return http.request({
    method: 'get',
    url: 'sysm/company/listByTree',
    params,
    cbs
  })
}

// 获取公司部门
interface ICompany {
  deptName: string
  order: number | null
  statusOrder: number | null
  companyIds: number | null
  [x: string]: string | number | null
}
export const listByTreeDept = (params: Partial<ICompany>, cbs?: () => void): Promise<any> => {
  return http.request({
    method: 'get',
    url: 'sysm/dept/listByTree',
    params,
    cbs
  })
}
