// 获取所属平台
export interface IPlatform {
  id: number
  platformName: string
  createUserId: number
  platformCode: string
  [key: string]: string | number
}

// 获取所属平台对应子菜单
export interface IPlatformTree {
  children: IPlatformTree[]
  checkFlag: boolean
  createUser: string
  orderNo: number
  id: number | string
  moduleName: string
  pId: number
  platformId: number
  platformName: string
  url: string
  createTime: string
  [x: string]: string | number | boolean | IPlatformTree[]
}

// 菜单列表
export interface IPropsTree {
  moduleName: string
  order: number | string
  statusOrder: any
  page: number
  size: number
  platformId: string
  PId: string
  status: string
  [x: string]: string | number | boolean
}

// 新增菜单
export interface IFormSub {
  actModelId: string | number
  actModelTypeId: number | string
  auditorFlag?: number
  fileName: string
  logo: string
  memo: string
  moduleName: string
  modulePath: string
  orderNo: number | string
  pId: number | string
  platformId: number | string
  status: number
  url: string
  [x: string]: any
}

export interface IBtnList {
  dicClass?: string
  dicCode?: string
  dicName: string
  dicValue: string
  id: number
  memo?: string
  orderNo?: number
  pId?: number
  status?: number
  systemFlag?: number
}
