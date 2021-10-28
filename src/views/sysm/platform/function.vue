<script lang="tsx">
import { ref, reactive, defineComponent, inject, provide, Ref } from 'vue'
import { ElMessage } from 'element-plus'
import Header from './components/public/header.vue'
import FormSearch from './components/public/formSearch.vue'
import Table from './components/function/table.vue'
import AddOrEditOrDel from './components/function/addOrEditOrDel.vue'
import { list, getList, dictionarylist } from '@/api/sysm/sysm'
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

    // 弹窗的逻辑与渲染
    const { initBtnList, RenderDialogAddOrDel, isBool, type } = useEffectDialog()
    initBtnList()

    // 表格的相关操作
    const { tableFunc, rows } = useTable(isBool, type)

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <HeaderCmp initParentTree={initParentTree} target={target} type={type} isBool={isBool}/>
          {tableFunc(loading)}
          {isBool.value ? <RenderDialogAddOrDel cbs={initPlatform} row={rows} type={type} /> : null}
        </>)
      }}

    </container>
  }
})

// 顶部组件
function HeaderCmp (props: { initParentTree: () => void, isBool: Ref<boolean>, target: IPropsTree, type: Ref<string>}) {
  const handleOperate = (type: string) => {
    if (type === 'add') {
      props.isBool.value = true
      props.type.value = 'add'
    }
    console.log('%c 🌽 type: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', type)
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
const useTable = (isBool: Ref<boolean>, type: Ref<string>) => {
  const rows = ref<any>()

  const handleOperation = (el:any, row: any, str: string): boolean => {
    if (str === 'edit') {
      isBool.value = true
      type.value = 'edit'
      rows.value = Object.assign({}, row, el)
    } else if (str === 'delete') {

    }
    return true
  }
  const handleTableSelect = (ids: string) => {
    // idList.value = ids
  }
  const tableFunc = (loading: Ref<boolean>) => {
    if (loading.value) {
      return <div>加载中</div>
    } else {
      return <Table id={'table2'} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
    }
  }
  return { tableFunc, type, rows }
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
  const RenderDialogAddOrDel = (props: {cbs: () => void, row: Ref<any>, type: Ref<string>}) => {
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
  return { isBool, type, initBtnList, RenderDialogAddOrDel }
}

</script>
