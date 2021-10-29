<script lang="tsx">
import { ref, reactive, defineComponent, inject, provide, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import Header from './components/public/header.vue'
import FormSearch from './components/public/formSearch.vue'
import Table from './components/function/table.vue'
import AddOrEditOrDel from './components/function/addOrEditOrDel.vue'
import { list } from '@/api/sysm/sysm'
import { getList, dictionarylist, deleteById, deleteByModel } from '@/api/sysm/function'
import Dialog from './components/public/dialog.vue'
import { IPlatform, IPlatformTree, IPropsTree, IBtnList } from '@/interface/sysm'
import fileSaver from '@/utils/exportFile'

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
      const { data } = await getList(target, () => {
        loading.value = false
      })
      listGather.parentTree = data
    }

    // 详情与编辑和新增弹窗的逻辑与渲染
    const { initBtnList, RenderDialogAddOrEdit, isBool, type } = useEffectDialog()
    initBtnList()

    // 删除弹窗
    const { isDel, RenderDialogDel } = useEffectDelete(initParentTree)

    // 表格的相关操作
    const { tableFunc, rows, ids } = useTable(isBool, type, isDel)

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <HeaderCmp initParentTree={initParentTree} target={target} type={type} isDel={isDel} isBool={isBool} ids={ids}/>
          {tableFunc(loading)}
          {isBool.value ? <RenderDialogAddOrEdit cbs={initPlatform} row={rows} type={type} /> : null}
          {isDel.value ? <RenderDialogDel rows={rows} ids={ids} /> : null}
        </>)
      }}

    </container>
  }
})

// 顶部组件
function HeaderCmp (props: { initParentTree: () => void, isBool: Ref<boolean>, isDel: Ref<boolean>, target: IPropsTree, type: Ref<string>, ids: Ref<number>}) {
  const listGather = inject<listData>('listData')
  const handleOperate = (type: string) => {
    if (type === 'add') {
      props.isBool.value = true
      props.type.value = 'add'
    } else if (type === 'delete') {
      if (!props.ids.value) {
        ElMessage.error({
          message: '请至少选择一条数据',
          type: 'error'
        })
        return false
      }
      props.isDel.value = true
      return true
    } else if (type === 'export') {
      listGather && fileSaver.exportExcel('#table2', '功能操作', 'application/octet-stream')
    }
  }
  return <Header { ...{ onHandleOperate: (type: string) => handleOperate(type) }}>
    {{ collapse: () => <FormSearchCmp initParentTree={props.initParentTree} target={props.target} /> }}
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
const FormSearchCmp = (props: {initParentTree: () => void, target: IPropsTree}) => {
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
  const listGather = inject<listData>('listData')
  return <FormSearch listGather={listGather} {...{ onSubmitSearchForm: submitSearchForm }} />
}

// 表格
const useTable = (isBool: Ref<boolean>, type: Ref<string>, isDel: Ref<boolean>) => {
  const rows = ref<any>()
  const ids = ref<number>(-1)
  const handleOperation = (el:any, row: any, str: string): boolean => {
    rows.value = Object.assign({}, row, el, { type: 1 })
    if (str === 'edit') {
      isBool.value = true
      type.value = 'edit'
      return true
    } else if (str === 'delete') {
      isDel.value = true
      return true
    }
    return true
  }
  const handleTableSelect = (idList: number) => {
    ids.value = idList
  }
  const tableFunc = (loading: Ref<boolean>) => {
    if (loading.value) {
      return <div>加载中</div>
    } else {
      return <Table id={'table2'} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
    }
  }
  return { tableFunc, ids, rows }
}

// 新增，详情，修改
const useEffectDialog = () => {
  const isBool = ref<boolean>(false)
  const listData = ref<IBtnList[]>([])
  const type = ref<string>('add')
  const initBtnList = async () => {
    const { data } = await dictionarylist({ dicCode: 'button' })
    listData.value = data
  }
  const RenderDialogAddOrEdit = (props: {cbs: () => void, row: Ref<any>, type: Ref<string>}) => {
    const handleCancel = () => {
      isBool.value = false
    }
    const successFunc = () => {
      isBool.value = false
      props.cbs()
    }

    return <dialogComp
      width={'70vw'}
      title={type.value === 'edit' ? '编辑' : type.value === 'details' ? '详情' : '新增'}
      v-model={[isBool.value, 'dialogVisible']}
    >
      {{
        main: () => <AddOrEditOrDel actionNameList={listData.value} row={props.row} type={props.type.value} {...{ onSuccessFunc: () => successFunc(), onHandleCancel: handleCancel }} />
      }}
    </dialogComp>
  }
  return { isBool, type, initBtnList, RenderDialogAddOrEdit }
}

// 删除弹窗
const useEffectDelete = (cbs: () => void) => {
  const isDel = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const handleCancel = () => {
    isDel.value = false
  }
  const handleSure = async (row: Ref<any>, ids:Ref<number>) => {
    loading.value = true
    if (row.value?.type === 1) {
      await deleteById(row.value.actionId, () => {
        loading.value = false
      })
    } else {
      const id = ids.value
      await deleteByModel(id, () => {
        loading.value = false
      })
      console.log('%c 🥓 ids: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', ids)
    }
    handleCancel()
    cbs()
  }
  const RenderDialogDel = (props: {rows: Ref<any>, ids: Ref<number>}) => {
    return <dialogComp title="提示" width={'14vw'} v-model={[isDel.value, 'dialogVisible']}>
      {{
        main: () => <div>确定删除这条数据吗？</div>,
        footer: () => <div>
          <el-button type="warning" plain size="mini" loading={loading.value} onClick={() => handleSure(props.rows, props.ids)}>确定</el-button>
          <el-button plain size="mini" onClick={handleCancel}>取消</el-button>
        </div>
      }}
    </dialogComp>
  }
  return { isDel, RenderDialogDel }
}
</script>
