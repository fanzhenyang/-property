export interface ILoginData {
  username: string
  password: string
  client_id: string
  client_secret: string
  grant_type: string
}

export interface UserData<T> {
  access_token: string
  expires_in: number
  jti: string
  refresh_token: string
  token_type: string
  user_name: T
}

export interface Users {
  deptCode: string
  deptId: string
  deptName: string
  groupName: string
  id: string
  staffId: string
  staffName: string
  sysUserFlag: string | number | null
}
