import http from '@/utils/http'
import { IPlatform, IPlatformTree, IFormSub, IPropsTree } from '@/interface/sysm'

// 文件上传
export function upload(data: any, cbs?: () => void): Promise<any> {
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
export const list = (params: null, cbs?: () => void): Promise<IPropsPlatform> => {
  return http.request({
    url: 'sysm/platform/list',
    method: 'get',
    cbs,
    params
  })
}

// 获取所属平台获取下面的菜单
export const listByTree = (params: IPropsTree | null, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/module/listByTree',
    method: 'get',
    cbs,
    params
  })
}

// 字典列表
export const dictionary = (params: { dicCode: string } | null, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/dictionary/list',
    method: 'get',
    params,
    cbs
  })
}

// 模块名称
export const treeListWithPlatform = (params: null, cbs?: () => void): Promise<any> => {
  return http.request({
    url: 'sysm/module/treeListWithPlatform',
    method: 'get',
    params,
    cbs
  })
}
