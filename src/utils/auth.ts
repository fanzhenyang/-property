/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
'use strict'
export class SessionStorage {
  public setItem<T> (key: string, option: T) {
    try {
      if (typeof option === 'string') {
        window.sessionStorage.setItem(key, option)
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(option))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public getItem (key: string) {
    try {
      const data:string | null = window.sessionStorage.getItem(key)
      if (data === null) {
        return data
      }
      return JSON.parse(JSON.stringify(data))
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public removeItem (key: string) {
    try {
      window.sessionStorage.removeItem(key)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public clear () {
    try {
      window.sessionStorage.clear()
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

const session = new SessionStorage()

export default session
