'use strict'
const componentsContext = require.context('@/components/public', true, /\.vue$/)

export const global = (_vue: { component: (arg0: any, arg1: any) => void }) => {
  componentsContext.keys().forEach(component => {
    // 获取文件中的 default 模块
    const componentConfig = componentsContext(component).default
    _vue.component(componentConfig.name, componentConfig)
  })
}
