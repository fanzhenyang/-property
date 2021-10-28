import http from '@/utils/http'
import { IPlatform, IPlatformTree, IFormSub, IPropsTree } from '@/interface/sysm'

// 文件上传
export function upload (data: any, cbs?:() => void):Promise<any> {
  return http.request({
    url: 'sysm/files/upload',
    method: 'post',
    data,
    cbs
  })
}

// 获取所属平台
interface IPropsPlatform {
  data: IPlatform[]
}
export const list = (params: null, cbs?:() => void):Promise<IPropsPlatform> => {
  return http.request({
    url: 'sysm/platform/list',
    method: 'get',
    cbs,
    params
  })
}

// 获取所属平台获取下面的菜单
export const listByTree = (params: IPropsTree | null, cbs?:() => void):Promise<any> => {
  return http.request({
    url: 'sysm/module/listByTree',
    method: 'get',
    cbs,
    params
  })
}

// 新增菜单
export const saveOrUpdate = (data: IFormSub, cbs?:() => void, msg = true):Promise<null> => {
  return http.request({
    url: 'sysm/module/saveOrUpdate',
    method: 'post',
    cbs,
    data,
    msg
  })
}

// 删除菜单
export const deleteById = (id: string, cbs?:() => void, msg = true):Promise<null> => {
  return http.request({
    url: `sysm/module/${id}`,
    method: 'delete',
    cbs,
    msg
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
export const BtnsaveOrUpdate = (data: any, cbs: () => void):Promise<any> => {
  return http.request({
    method: 'post',
    url: 'sysm/action/saveOrUpdate',
    data,
    cbs
  })
}
