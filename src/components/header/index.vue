<script lang="tsx">
import { defineComponent, ref, provide, inject } from 'vue'
import { useRouter, Router } from 'vue-router'
import { useStore } from 'vuex'
import { Menu } from '@/interface/menu'
export default defineComponent({
  name: 'Header',
  setup () {
    // 获取初始化
    const menuList = ref<Menu[]>([])
    const router = useRouter()
    const store = useStore()
    provide('router', router)

    // 异步请求
    const initRouteList = async () => {
      const data = await store.dispatch('menu/getRouter')
      menuList.value = data
    }

    initRouteList()
    const exit = () => {
      store.dispatch('user/exit')
    }
    return () => (
      <header class="header">
        <img src={require('../../assets/img/menu/dian.png')} alt="" class="header-dian" />
        <h1 class="header-title">铁路投资建设智慧管控平台</h1>
        <div class="header-main">
          <img src={require('../../assets/img/logo/logo.png')} alt="" class="header-img" />
          <MenuComp menuList={menuList.value} />
          <div class="header-main-user">
            <div>返回首页</div>
            <el-popover
              placement="bottom"
              trigger="hover"
              width={90}
              popperClass="header-menu-popover"
            >
              {{
                default: () => <ul class="header-menu-ul"><li>修改密码</li><li onClick={() => exit()}>退出登录</li></ul>,
                reference: () => <div><i class="iconfont icon-yonghutianchong"></i><span>admin</span></div>
              }}

            </el-popover>
          </div>
        </div>
      </header>
    )
  }
})
const handleSelect = (index: string, indexPath: string, item: Menu) => {
  console.log('%c 🌭 item: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', item)
  console.log('%c 🥒 indexPath: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', indexPath)
  console.log('%c 🥔 index: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', index)
}

const MenuComp = (props: { menuList: Menu[] }) => {
  if (props.menuList.length > 0) {
    const router = inject<Router | any>('router')
    return (
      <el-menu class="el-menu-demo header-menu" mode="horizontal" onSelect={(index: string, indexPath: string, item: Menu) => handleSelect(index, indexPath, item)} backgroundColor="#043078" textColor="#fff" activeTextColor="#fff">
        {
          props.menuList.map((item: Menu) => {
            if (item.children && item.children.length > 0) {
              return <el-sub-menu index={item.moduleId + ''} key={item.moduleId} vSlots={slots(item.moduleName, item, router)}>
                <MenuChild list={item.children} />
              </el-sub-menu>
            } else {
              return <el-menu-item index={item.moduleId + ''}>{slots(item.moduleName)}</el-menu-item>
            }
          })
        }
      </el-menu>
    )
  }
  return null
}

interface IMenuItem {
  index: string
  indexPath: string[]
}
const routerItem = (i: IMenuItem, el: Menu, router: Router) => {
  if (typeof (router as Router) === 'object') {
    const path = el.url
    router.push(path as string)
  }
}

const handleClick = (el: Menu | unknown, router: Router) => {
  const path = (el as Menu)?.url
  router && router.push(path as string)
}

const slots = (name: string, el?: Menu, router?: Router) => {
  return {
    title: () => <div class="header-menu-title" onClick={() => handleClick(el, router as Router)}>{name}</div>
  }
}
const MenuChild = (props: {list: Menu[]}) => {
  const router = inject<Router | any>('router')
  return (
    <>
      {
        props.list.map(el => {
          if (el.children && el.children.length > 0) {
            return <el-sub-menu index={el.moduleId + ''} vSlots={slots(el.moduleName)}>
              <MenuChild list={el.children} />
            </el-sub-menu>
          } else {
            return <el-menu-item onClick={(i:IMenuItem) => { routerItem(i, el, router) }} popperClass="hader-menu-item" index={el.moduleId + ''}>{slots(el.moduleName)}</el-menu-item>
          }
        })
      }
    </>
  )
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  background: $bg url("../../assets/img/menu/nav_top.png") no-repeat center
    center;
  background-size: 100% 100%;
  min-height: 8rem;
  width: 100%;
  color: $fff;
  &-main {
    @include flex-center(flex-start, flex-end);
    height: 100%;
    min-height: 7rem;
    padding: 0 1rem 1rem 1rem;
    box-sizing: border-box;
    &-user {
      @include flex-center(space-between, center);
      flex: 0 0 8%;
      height: 3.4rem;
    }
  }
  &-img {
    width: 36rem;
  }
  &-dian {
    position: absolute;
    left: 123rem;
  }
  &-title {
    @include vertically;
    font-size: 3.84rem;
    left: 48.5%;
    color: $fff;
  }
  &-menu {
    position: relative;
    background-color: transparent !important;
    border-bottom: none !important;
    margin-left: 0.8rem;
    flex: 1;
    &-title {
      width: 100%;
      height: 3.4rem;
      line-height: 3.4rem;
      text-align: center;
    }
    /deep/.el-sub-menu,
    /deep/.el-menu-item {
      @include flex-center;
      position: relative;
      background: url("../../assets/img/menu/menu_bg_left.png") no-repeat center
        center;
      width: 15rem;
      height: 3.4rem;
      background-size: 100% 100%;
      background-color: transparent !important;
      &:nth-of-type(n + 3) {
        background: url("../../assets/img/menu/menu_bg_right.png") no-repeat
          center center;
        left: 52rem;
        background-size: 100% 100%;
      }
      .el-sub-menu__title {
        @include flex-center;
        width: 100%;
        height: 100%;
        line-height: 0;
        background-color: transparent !important;
        &:hover {
          background-color: transparent;
          outline: none;
          color: $fff;
        }
      }
    }
    /deep/.el-menu-item {
      background: url("../../assets/img/menu/menu_bg_left.png") no-repeat center
        center;
      background-size: 100% 100%;
      // left: 52rem;
      &:hover {
        background-color: transparent !important;
        outline: none !important;
        color: $fff !important;
      }
    }
    /deep/.el-sub-menu__icon-arrow {
      display: none;
    }
    &-ul {
      color: $fff;
      > li {
        cursor: pointer;
        line-height: 2.5;
      }
    }
  }
}
</style>

<style lang="scss">
.header-menu-popover {
  background: #163175 !important;
  min-width: 80px !important;
  .el-popper__arrow {
    &::before {
      background: #163175 !important;
      border: none !important;
      outline: none;
    }
  }
}
</style>
