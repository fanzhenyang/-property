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
  status: string | number | null
  [x: string]: string | number | boolean | null
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
  id: unknown
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

export interface IActive {
  actionList: [{
    actionId: number
    actionName: string
    description: string
    orderNo: number
    status: number
    checkFlag?: boolean
  }]
  checkFlag: boolean
  children: IActive[]
  id: number
  moduleName: string
  pId: number
  platformCode: string
  platformId: number
  platformName: string
  [x: string]: any
}

export interface IGropList {
  groupName?: string
  groupTypeOrder?: string
  statusOrder?: string | number
  page: number
  size: number
}

export interface IGropListData {
  adminFlag: number
  groupName: string
  groupType: string | null
  id: number
  memo: string
  moduleName: string
  orderNo: number
  status: number
}

export interface IDictionaryData {
  dicClass: string
  dicCode: string
  dicName: string
  dicValue: string
  id: number
  memo: string | null
  orderNo: number
  pId: number
}
