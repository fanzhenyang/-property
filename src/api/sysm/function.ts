import http from '@/utils/http'
// 获取按钮的分类
export const dictionarylist = (params: { dicCode: string }, cbs?:() => void):Promise<any> => {
  return http.request({
    method: 'get',
    url: 'sysm/dictionary/list',
    params,
    cbs
  })
}

// 获取按钮的分类新增和编辑
export const saveOrUpdate = (data: any, cbs: () => void, type = 'add', msg = true):Promise<any> => {
  return http.request({
    method: 'post',
    url: 'sysm/action/saveOrUpdate',
    data,
    type,
    cbs,
    msg
  })
}

// 删除功能名称
export const deleteById = (id: number, cbs: () => void, type = 'delete', msg = true):Promise<any> => {
  return http.request({
    url: `sysm/action/${id}`,
    method: 'delete',
    msg,
    type,
    cbs
  })
}

// 删除模块
export const deleteByModel = (id: number, cbs: () => void, type = 'delete', msg = true):Promise<any> => {
  return http.request({
    url: `sysm/action/deleteByModel/${id}`,
    method: 'delete',
    msg,
    type,
    cbs
  })
}

// 获取功能操作模块list
export const getList = (params: any, cbs?:() => void):Promise<any> => {
  return http.request({
    url: 'sysm/action/listByTree',
    method: 'get',
    params,
    cbs
  })
}
