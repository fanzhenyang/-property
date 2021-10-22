<script lang="tsx">
import { ref, reactive, readonly, defineComponent, inject, provide, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import Header from './components/header.vue'
import FormSearch from './components/modular/formSearch.vue'
import Table from './components/modular/table.vue'
import AddOrEditOrDel from './components/modular/addOrEditOrDel.vue'
import Dialog from './components/public/dialog.vue'
import { list, listByTree, deleteById } from '@/api/sysm/sysm'
import { treeList } from '@/api/act/act'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
export interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
}
export default defineComponent({
  setup () {
    const listGather = reactive<listData>({
      platformList: [],
      parentTree: []
    })
    provide('listData', listGather)
    // 异步获取所属平台
    const initPlatform = async () => {
      const { data } = await list(null)
      listGather.platformList = data
      initParentTree()
    }
    initPlatform()

    // 获取所属平台对应menu
    const initParentTree = async () => {
      const { data } = await listByTree(null)
      listGather.parentTree = data
    }
    const isBool = ref(false)
    // 表格的相关操作
    const { type, tableFunc } = useTable(isBool)
    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <HeaderCmp isBool={isBool} type={type}/>
          {tableFunc()}
          {isBool.value ? <AddOrEditOrDelCmp isBool={isBool} type={type}/> : null }
        </>)
      }}

    </container>
  }
})

// 顶部组件
function HeaderCmp (props: {isBool: Ref<boolean>, type: Ref<string>}) {
  const handleOperate = (type: string) => {
    if (type === 'delete') {
      // if (!ids.value) {
      ElMessage.error({
        message: '请至少选择一条数据',
        type: 'error'
      })
      return false
    } else if (type === 'add') {
      props.isBool.value = true
      props.type.value = 'add'
    }
  }
  return <Header { ...{ onHandleOperate: (type: string) => handleOperate(type) }}>
    {{ collapse: () => <FormSearchCmp /> }}
  </Header>
}

// 顶部查询组件
const FormSearchCmp = () => {
  const submitSearchForm = () => {
    console.log(123)
  }
  const listGather = inject<listData>('listData')
  return <FormSearch listGather={listGather} {...{ onSubmitSearchForm: submitSearchForm }} />
}

// 表格
const useTable = (isBool: Ref<boolean>) => {
  const type = ref<string>('add')
  const handleOperation = (row: IPlatformTree, str: string) => {
    console.log('%c 🍫 row: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', row)
    isBool.value = true
    type.value = str
  }
  const tableFunc = () => {
    return <Table {...{ onHandleOperation: handleOperation }} />
  }
  return { tableFunc, type }
}

// 新增编辑和详情弹窗
const AddOrEditOrDelCmp = (props: { isBool: Ref<boolean>, type: Ref<string> }) => {
  // const bool = ref<boolean>(props.isBool.value || false)
  const listGather = inject<listData>('listData')
  const successFunc = (isBool: Ref<boolean>, cbs?: () => void, type?: string) => {
    console.log('%c 🥕 isBool: ', 'font-size:20px;background-color: #465975;color:#fff;', isBool)
  }
  return <Dialog
    title={props.type.value === 'edit' ? '编辑' : props.type.value === 'details' ? '详情' : '新增'}
    width={'70vw'}
    v-model={[props.isBool.value, 'dialogVisible']}
  >
    {{
      main: () => <AddOrEditOrDel ElMessage={ElMessage} type={props.type.value} listGather={listGather} {...{ onSuccessFunc: () => successFunc(props.isBool) }} />
    }}
  </Dialog>
}
</script>
