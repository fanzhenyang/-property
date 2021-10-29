import http from '@/utils/http'
import { IFormSub } from '@/interface/sysm'
// 新增菜单
export const saveOrUpdate = (data: IFormSub, cbs?:() => void, type = 'add', msg = true):Promise<null> => {
  return http.request({
    url: 'sysm/module/saveOrUpdate',
    method: 'post',
    cbs,
    type,
    data,
    msg
  })
}

// 删除菜单
export const deleteById = (id: string, cbs?:() => void, type = 'delete', msg = true):Promise<null> => {
  return http.request({
    url: `sysm/module/${id}`,
    method: 'delete',
    cbs,
    type,
    msg
  })
}
