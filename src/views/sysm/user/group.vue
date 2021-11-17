<script lang="tsx">
import { defineComponent, reactive, ref, Ref } from 'vue'
import Header from '../components/public/header.vue'
import Table from './components/group/table'
import AddOrEditOrDel from './components/group/dialogAddOrEditDel'
import DialogTable from './components/group/dialogTable'
import HeaderSearch from './components/group/headerSearch'
import { dictionary } from '@/api/sysm/sysm'
import { listPage, deleteById } from '@/api/sysm/group'
import { IGropListData, IDictionaryData } from '@/interface/sysm'
import { Ipagination } from '@/interface/public'
import { ElForm, ElMessage } from 'element-plus'
import fileSaver from '@/utils/exportFile'
export default defineComponent({
  setup() {
    const { dialogRender, typeStr, dialogVisible } = useAddOrEditEffect()
    const { initDeleteRender, deleteShow } = useDeleteEffect()
    const { tableRender, initTable, checkList, rows } = useTableEffect(typeStr, dialogVisible, deleteShow)
    const { headerRender } = useHeaderEffect(checkList, dialogVisible, deleteShow, typeStr)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            { headerRender(initTable) }
            { tableRender() }
            { dialogVisible.value ? dialogRender(rows as Ref<IGropListData>, initTable) : null}
            { deleteShow.value ? initDeleteRender(checkList.value, initTable) : null }
          </>)
        }}
      </container>
    )
  }
})

// 表格
interface IForm {
  groupName?: string
  status?: number | null
}
const useTableEffect = (typeStr: Ref<string>, dialogVisible: Ref<boolean>, deleteShow: Ref<boolean>) => {
  const loading = ref<boolean>(false)
  const tableList = ref<IGropListData[]>([])
  const pagination = reactive<Ipagination>({
    page: 1,
    size: 10,
    total: 0
  })
  const initData = reactive<IForm>({
    groupName: '',
    status: null
  })

  const initTable = async (dataForm: IForm = {}) => {
    if (Object.keys(dataForm).length > 0) {
      initData.groupName = dataForm.groupName
      initData.status = dataForm.status
    }
    const target = {
      ...pagination,
      ...initData
    }
    loading.value = true
    const { data: { paginationPage, records } } = await listPage(target, () => {
      loading.value = false
    })
    tableList.value = records
    paginationPage && Object.keys(paginationPage).forEach(key => {
      pagination[key] = paginationPage[key]
    })
  }
  initTable()

  const rows = ref<IGropListData>()
  const handleOperation = (row: IGropListData, str: string) => {
    if (str === 'edit' || str === 'details' || str === 'assign') {
      typeStr.value = str
      rows.value = row
      dialogVisible.value = true
    } else if (str === 'delete') {
      deleteShow.value = true
      rows.value = row
    }
  }
  const checkList = ref<number>(0)
  const handleTableSelect = (id: number) => {
    checkList.value = id
  }

  const handlePaginationChange = (val: number, type: string) => {
    if (type === 'size') {
      pagination.size = val
      pagination.page = 1
    } else if (type === 'current') {
      pagination.page = val
    }
    initTable()
  }
  const tableRender = () => {
    return <>
      <div vLoading={loading.value}>
        <Table id={'table3'} tableList={tableList.value} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
      </div>
      <paginationComp currentPage={pagination.page} pageSize={pagination.size} total={pagination.total} {...{ onHandlePaginationChange: handlePaginationChange }} />
    </>
  }
  return { tableRender, initTable, checkList, rows }
}

// 顶部按钮
const useHeaderEffect = (checkList: Ref<number>, dialogVisible: Ref<boolean>, deleteShow: Ref<boolean>, typeStr: Ref<string>) => {
  const handleOperate = (str: string) => {
    if (str === 'add') {
      typeStr.value = 'add'
      dialogVisible.value = true
      return true
    } else if (str === 'delete') {
      if (!checkList.value) {
        ElMessage.error('请至少选择一条数据')
        return false
      }
      deleteShow.value = true
      return true
    } else if (str === 'export') {
      fileSaver.exportExcel('#table3', '用户组分类', 'application/octet-stream')
    }
  }
  const headerSubmitFrom = (form: IForm, cbs:(data: IForm) => void) => {
    cbs(form)
  }
  const headerRender = (cbs: () => void) => {
    return <Header {...{ onHandleOperate: (str: string) => handleOperate(str) }}>
      {{
        collapse: () => <HeaderSearch {...{ onHeaderSubmitFrom: (form: IForm) => headerSubmitFrom(form, cbs) }} />
      }}
    </Header>
  }
  return { headerRender }
}

// 新增编辑弹窗
const useAddOrEditEffect = () => {
  const typeStr = ref<string>('add')
  const dialogVisible = ref<boolean>(false)

  const dictionaryList = ref<IDictionaryData[]>([])
  const initDictionary = async() => {
    const { data } = await dictionary({ dicCode: 'GroupType' })
    dictionaryList.value = data
  }
  initDictionary()

  const handleDialogCancel = () => {
    dialogVisible.value = false
  }

  const successFunc = (cbs: () => void) => {
    handleDialogCancel()
    cbs && cbs()
  }

  const dialogRender = (rows: Ref<IGropListData>, cbs: () => void) => {
    return <dialogComp
      width={'70vw'}
      title={typeStr.value === 'edit' ? '编辑' : typeStr.value === 'details' ? '详情' : typeStr.value === 'assign' ? '分配权限' : '新增'}
      v-model={[dialogVisible.value, 'dialogVisible']}
    >
      {{
        main: () => typeStr.value !== 'assign' ? <AddOrEditOrDel dictionaryList={dictionaryList.value} type={typeStr.value} row={rows.value} {...{ onHandleDialogCancel: handleDialogCancel, onSuccessFunc: () => successFunc(cbs) }} /> : <DialogTable row={rows.value} id={'tableDialog'} />
      }}
    </dialogComp>
  }
  return { dialogRender, typeStr, dialogVisible }
}

// 删除弹窗
const useDeleteEffect = () => {
  const deleteShow = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const handleCancel = () => {
    deleteShow.value = false
  }
  const handleDelete = async(ids: number, cbs: () => void) => {
    loading.value = true
    await deleteById(ids, () => {
      loading.value = false
    })
    deleteShow.value = false
    cbs && cbs()
  }
  const initDeleteRender = (ids: number, cbs: () => void) => {
    return <dialogComp title="提示" width={'14vw'} v-model={[deleteShow.value, 'dialogVisible']}>
      {{
        main: () => <div>确定删除这条数据吗？</div>,
        footer: () => <div>
          <el-button type="warning" plain size="mini" loading={loading.value} onClick={() => handleDelete(ids, cbs)}>确定</el-button>
          <el-button plain size="mini" onClick={() => handleCancel()}>取消</el-button>
        </div>
      }}
    </dialogComp>
  }
  return { initDeleteRender, deleteShow }
}
</script>
