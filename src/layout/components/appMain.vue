<script lang="tsx">
import { defineComponent, Transition, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { _RouteLocationBase, useRoute, RouteRecord, useRouter } from 'vue-router'
import { Menu } from '@/interface/menu'

export default defineComponent({
  setup () {
    // const store = useStore()
    // const route = useRoute()
    // const routers = useRouter()
    // type targetRouter = RouteRecord & _RouteLocationBase
    // const internalInstance = getCurrentInstance()
    // const setAddRoters = (list: Menu[], router: targetRouter) => {
    //   list.forEach(item => {
    //     // debugger
    //     if ((item.url && item.modulePath) || (item.children && item.children.length > 0)) {
    //       // console.log('%c 🍪 item: ', 'font-size:20px;background-color: #465975;color:#fff;', item)
    //       if (item.url && item.modulePath) {
    //         const i = item.modulePath.indexOf('/')

    //         router.children.push({
    //           path: `${item.url}`,
    //           component: i !== 0 ? () => import(`@/views/${item.modulePath}.vue`) : () => import(`@/views${item.modulePath}.vue`),
    //           name: item.url?.split('/')[item.url?.split('/').length - 1],
    //           meta: {

    //           }
    //         })
    //       }
    //       if (item.children && item.children.length > 0) {
    //         setAddRoters(item.children, router)
    //       } else {
    //         routers.addRoute(router)
    //         // console.log('%c 🍚 router: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', router)
    //       }
    //     }
    //   })
    // }

    // watch(() => store.state.menu.routers, val => {
    //   console.log('%c 🍸 val: ', 'font-size:20px;background-color: #42b983;color:#fff;', val)
    //   if (val.length > 0 && internalInstance) {
    //     internalInstance.appContext.config.globalProperties.$router.options.routes.forEach((router: targetRouter) => {
    //       if (router.name === 'Layout') {
    //         setAddRoters(val, router)
    //       }
    //     })
    //   }
    // }, { deep: true })

    return () => (
      <div class="layout">
        <Transition name="fade-transform" mode="out-in">
          <router-view key="key" />
        </Transition>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
.layout {
  min-height: calc(100vh - 8rem);
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
