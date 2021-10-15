import http from '@/utils/http'
import { TreeList } from '@/interface/act'
// 流程分类
interface IProps {
  data: TreeList
}
export function treeList (params: null, cbs?:() => void):Promise<IProps> {
  return http.request({
    url: 'act/modelType/treeList',
    method: 'get',
    params,
    cbs
  })
}

// 流程名称
interface Iparams {
  category: number | string
  status: number
}
export function list (params: Iparams, cbs?:() => void):Promise<any> {
  return http.request({
    url: 'act/model/list',
    method: 'get',
    params,
    cbs
  })
}
