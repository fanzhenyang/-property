<script lang="tsx">
import { ref, reactive, defineComponent, inject, provide, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import Header from './components/public/header.vue'
import FormSearch from './components/public/formSearch.vue'
import Table from './components/modular/table.vue'
import AddOrEditOrDel from './components/modular/addOrEditOrDel.vue'
import { list, listByTree } from '@/api/sysm/sysm'
import { deleteById } from '@/api/sysm/modular'
import { treeList } from '@/api/act/act'
import { TreeList } from '@/interface/act'
import { IPlatform, IPlatformTree, IPropsTree } from '@/interface/sysm'
import fileSaver from '@/utils/exportFile'
export interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
  treeList: TreeList[]
}
export default defineComponent({
  setup () {
    const listGather = reactive<listData>({
      platformList: [],
      parentTree: [],
      treeList: []
    })
    const loading = ref<boolean>(false)
    provide('listData', listGather)
    // 异步获取所属平台
    const initPlatform = async () => {
      const { data } = await list(null)
      listGather.platformList = data
      loading.value = true
      initParentTree()
    }
    initPlatform()

    // 获取所属平台对应menu
    const target = reactive<IPropsTree>({
      moduleName: '',
      order: 0,
      statusOrder: 0,
      page: 1,
      size: 999,
      platformId: '',
      PId: '',
      status: ''
    })
    const initParentTree = async () => {
      const { data } = await listByTree(target, () => {
        loading.value = false
      })
      listGather.parentTree = data
    }

    // 获取流程
    const flow = async () => {
      const { data } = await treeList(null)
      listGather.treeList = data.children
    }
    flow()
    const isBool = ref<boolean>(false)
    const idList = ref<string>('')

    // 删除弹窗操作
    const { isDel, initComp } = useEffectDelete(initParentTree, idList)

    // 表格的相关操作
    const { type, tableFunc, rows } = useTable(isBool, isDel, idList)

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <HeaderCmp isBool={isBool} type={type} isDel={isDel} idList={idList} target={target} initParentTree={initParentTree}/>
          {tableFunc(loading)}
          {isBool.value ? <AddOrEditOrDelCmp isBool={isBool} type={type} cbs={initParentTree} rows={rows}/> : null }
          {isDel.value ? initComp() : null}
        </>)
      }}

    </container>
  }
})

// 顶部组件
function HeaderCmp (props: {isBool: Ref<boolean>, type: Ref<string>, isDel: Ref<boolean>, idList: Ref<string>, target: IPropsTree, initParentTree: () => void}) {
  const listGather = inject<listData>('listData')
  const handleOperate = (type: string) => {
    if (type === 'delete') {
      if (props.idList.value) {
        props.isDel.value = true
        return true
      }
      ElMessage.error({
        message: '请至少选择一条数据',
        type: 'error'
      })

      return false
    } else if (type === 'add') {
      props.isBool.value = true
      props.type.value = 'add'
    } else if (type === 'export') {
      listGather && fileSaver.exportExcel('#table1', '菜单管理', 'application/octet-stream')
    }
  }
  return <Header { ...{ onHandleOperate: (type: string) => handleOperate(type) }}>
    {{ collapse: () => <FormSearchCmp target={props.target} initParentTree={props.initParentTree} /> }}
  </Header>
}

// 顶部查询组件
interface iFormSearch {
  moduleName: string
  status: number
  platformId: number
  pId: number
  [x: string] : string | number
}
const FormSearchCmp = (props: {target: IPropsTree, initParentTree: () => void}) => {
  const submitSearchForm = (form: iFormSearch) => {
    Object.keys(form).forEach(key => {
      if (key === 'pId') {
        props.target.PId = form.pId + ''
      } else {
        props.target[key] = form[key]
      }
    })
    props.initParentTree()
  }
  const resetSearchForm = (form: iFormSearch) => {
    Object.keys(form).forEach(key => {
      props.target[key] = form[key]
    })
    console.log('%c 🍜 props.target: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', props.target)
  }
  const listGather = inject<listData>('listData')
  return <FormSearch listGather={listGather} {...{ onSubmitSearchForm: submitSearchForm, onResetSearchForm: resetSearchForm }} />
}

// 表格
const useTable = (isBool: Ref<boolean>, isDel: Ref<boolean>, idList: Ref<string>) => {
  const type = ref<string>('add')
  const rows = ref<any>()

  const handleOperation = (row: IPlatformTree, str: string): boolean => {
    if (str === 'delete') {
      idList.value = row.id + ''
      isDel.value = true
      return true
    }
    isBool.value = true
    type.value = str
    rows.value = row
    return true
  }
  const handleTableSelect = (ids: string) => {
    idList.value = ids
  }
  const tableFunc = (loading: Ref<boolean>) => {
    if (loading.value) {
      return <div>加载中</div>
    } else {
      return <Table id={'table1'} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
    }
  }
  return { tableFunc, type, rows }
}

// 新增编辑和详情弹窗
const AddOrEditOrDelCmp = (props: { isBool: Ref<boolean>, type: Ref<string>, cbs: () => void, rows: Ref<IPlatformTree> }) => {
  const listGather = inject<listData>('listData')
  const successFunc = (isBool: Ref<boolean>) => {
    isBool.value = false
    props.cbs()
  }
  const handleCancel = () => {
    props.isBool.value = false
  }
  return <dialogComp
    width={'70vw'}
    title={props.type.value === 'edit' ? '编辑' : props.type.value === 'details' ? '详情' : '新增'}
    v-model={[props.isBool.value, 'dialogVisible']}
  >
    {{
      main: () => <AddOrEditOrDel rows={props.rows} type={props.type.value} listGather={listGather} {...{ onSuccessFunc: () => successFunc(props.isBool), onHandleCancel: handleCancel }} />
    }}
  </dialogComp>
}

// 删除弹窗
const useEffectDelete = (cbs: () => void, idList: Ref<string>) => {
  const isDel = ref<boolean>(false)
  const handleCancel = () => {
    idList.value = ''
    isDel.value = false
  }
  const handleSure = async () => {
    await deleteById(idList.value)
    handleCancel()
    cbs()
  }
  const initComp = () => {
    return <dialogComp title="提示" width={'14vw'} v-model={[isDel.value, 'dialogVisible']}>
      {{
        main: () => <div>确定删除这条数据吗？</div>,
        footer: () => <div>
          <el-button type="warning" plain size="mini" onClick={handleSure}>确定</el-button>
          <el-button plain size="mini" onClick={handleCancel}>取消</el-button>
        </div>
      }}
    </dialogComp>
  }
  return { isDel, initComp }
}
</script>
