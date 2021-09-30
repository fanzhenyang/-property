// 获取所属平台
export interface IPlatform {
  id: number
  platformName: string
  createUserId: number
  platformCode: string
}

// 获取所属平台对应子菜单
export interface IPlatformTree {
  children: IPlatformTree[]
  checkFlag: boolean
  createUser: string
  orderNo: number
  id: number
  moduleName: string
  pId: number
  platformId: number
  platformName: string
  url: string
  createTime: string
}
