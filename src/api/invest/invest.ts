import http from '@/utils/http'
import { HomeTop, HomeCompairPercent, HomeCompairInvest, HomeMothItem, HomeYearItem } from '@/interface/investmentManage'

// 重大项目投资top8
interface IProps {
  data: HomeTop[]
}
export function homeTopInvest (params: {limitParam: number}, cbs?:() => void):Promise<IProps> {
  return http.request({
    url: 'invest/TzProject/homeTopInvest',
    method: 'get',
    params,
    cbs
  })
}

// 本年度投资金额占比
interface IPropsPercent {
  data: HomeCompairPercent[]
}
export function homeCompairPercent (params: null, cbs?:() => void):Promise<IPropsPercent> {
  return http.request({
    url: 'invest/TzProject/homeCompairPercent',
    method: 'get',
    params,
    cbs
  })
}

// 去年与今年投资对比
interface IPropsInvest {
  data: HomeCompairInvest
}
export function homeCompairInvest (params: null, cbs?:() => void):Promise<IPropsInvest> {
  return http.request({
    url: 'invest/TzProject/homeCompairInvest',
    method: 'get',
    params,
    cbs
  })
}

// 本月投资进度
interface IPropsMonth {
  data: Array<HomeMothItem>
}
export function homeInvestThisMonth (params: null, cbs?:() => void):Promise<IPropsMonth> {
  return http.request({
    url: 'invest/TzProject/homeInvestThisMonth',
    method: 'get',
    params,
    cbs
  })
}

// 本年度计划投资与实际投资对比  TzProject/homeCompairPalnAndBudget
interface IPropsYear {
  data: HomeYearItem
}
export function homeCompairPalnAndBudget (params: null, cbs?:() => void):Promise<IPropsYear> {
  return http.request({
    url: 'invest/TzProject/homeCompairPalnAndBudget',
    method: 'get',
    params,
    cbs
  })
}
