import http from '@/utils/http'
import { IGropList } from '@/interface/sysm'

// 用户组管理
export const listPage = (params: IGropList, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/group/listPage',
    method: 'get',
    params,
    cbs
  })
}

// 用户组编辑和新增
export const saveOrUpdate = (data: any, cbs?: () => void, type = 'add', msg = true): Promise<any> => {
  return http.request({
    method: 'post',
    url: '/sysm/group/saveOrUpdate',
    data,
    cbs,
    type,
    msg
  })
}

// 用户组删除
export const deleteById = (id: number, cbs?: () => void, type = 'delete', msg = true): Promise<any> => {
  return http.request({
    url: `/sysm/group/${id}`,
    method: 'delete',
    cbs,
    type,
    msg
  })
}

// 用户组详情
export const group = (id: number, cbs?: () => void): Promise<any> => {
  return http.request({
    url: `/sysm/group/${id}`,
    method: 'get',
    cbs
  })
}
