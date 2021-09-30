import { IRootState } from './index'
const getters = {
  routes: (state: IRootState) => state.menu.routers
}

export default getters
