import {
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElCol,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElInfiniteScroll,
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElPopover,
  ElScrollbar,
  ElPagination,
  ElCollapseTransition,
  ElPopconfirm,
  ElSelect,
  ElOption,
  ElTree,
  ElCheckboxGroup,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElUpload,
  ElConfigProvider
} from 'element-plus/lib/'

const elemnt: any[] = [
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElPagination,
  ElSwitch,
  ElCol,
  ElRow,
  ElForm,
  ElFormItem,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElPopover,
  ElScrollbar,
  ElCollapseTransition,
  ElSelect,
  ElOption,
  ElTree,
  ElPopconfirm,
  ElCheckbox,
  ElCheckboxGroup,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElUpload,
  ElConfigProvider
]

const plugins: any[] = [
  ElInfiniteScroll,
  ElMessage,
  ElMessageBox,
  ElNotification
]

const ElememtCom = (_app: { component: (arg0: any, arg1: any) => void; use: (arg0: any) => void }) => {
  elemnt.forEach(component => {
    _app.component(component.name, component)
  })

  plugins.forEach(plugin => {
    _app.use(plugin)
  })
}

export default ElememtCom
