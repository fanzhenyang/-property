import http from '@/utils/http'

// 用户管理列表
interface IForm {
  account?: string
  page: number
  size: number
  status?: number | null
  lockFlag?: number | null
  incumbentFlag?: number | null
  groupId?: number | null
  [x: string]: string | number | null | undefined
}
export const listPage = (params: IForm, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/user/listPage',
    method: 'get',
    params,
    cbs
  })
}

// 新增和编辑
export const saveOrUpdate = (data: any, cbs?: () => void, type = 'add', msg = true): Promise<any> => {
  return http.request({
    url: 'sysm/user/saveOrUpdate',
    method: 'post',
    data,
    cbs,
    type,
    msg
  })
}

// 删除
export const deleteById = (id: number, cbs?: () => void, type = 'delete', msg = true): Promise<any> => {
  return http.request({
    url: `sysm/user/${id}`,
    method: 'delete',
    cbs,
    type,
    msg
  })
}

// 查看详情
export const detailById = (id: number): Promise<any> => {
  return http.request({
    url: `sysm/user/${id}`,
    method: 'get'
  })
}
