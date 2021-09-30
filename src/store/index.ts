import { createStore } from 'vuex'
import getters from './getters'
import { IState } from './modules/menu'
// import getters from './getters'
// interface iModules {
//   [modalTypeVisible: string | number]: any
// }
// type OptionRequirements = Record<Options, iModules>

const modulesFiles = require.context('./modules', true, /\.ts$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules: any, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export interface IRootState {
  menu: IState
}

const store = createStore({
  modules,
  getters
  // getters
})

export default store
