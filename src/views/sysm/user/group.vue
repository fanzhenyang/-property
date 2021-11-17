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
import { ElForm, ElMessage } from 'element-plus'
export default defineComponent({
  setup() {
    const { dialogRender, typeStr, dialogVisible } = useAddOrEditEffect()
    const { tableRender, initTable, checkList, rows } = useTableEffect(typeStr, dialogVisible)
    const { headerRender } = useHeaderEffect(checkList)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            { headerRender() }
            { tableRender() }
            { dialogVisible.value ? dialogRender(rows as Ref<IGropListData>, initTable) : null}
          </>)
        }}
      </container>
    )
  }
})
// 表格
const useTableEffect = (typeStr: Ref<string>, dialogVisible: Ref<boolean>) => {
  const loading = ref<boolean>(false)
  const tableList = ref<IGropListData[]>([])

  const initTable = async () => {
    const target = {
      page: 1,
      size: 10
    }
    loading.value = true
    const { data: { records } } = await listPage(target, () => {
      loading.value = false
    })
    tableList.value = records
  }
  initTable()

  const rows = ref<IGropListData>()
  const handleOperation = (row: IGropListData, str: string) => {
    if (str === 'edit') {
      typeStr.value = str
      rows.value = row
      dialogVisible.value = true
    } else if (str === 'delete') {
      // deleteShow.value = true
      rows.value = row
    }
  }
  const checkList = ref<number>(0)
  const handleTableSelect = (id: number) => {
    checkList.value = id
  }
  const tableRender = () => {
    return <Table id={'table3'} tableList={tableList.value} loading={loading.value} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
  }
  return { tableRender, initTable, checkList, rows }
}

// 顶部按钮
const useHeaderEffect = (checkList: Ref<number>) => {
  const handleOperate = (str: string) => {
    if (str === 'add') {

    } else if (str === 'delete') {
      if (!checkList.value) {
        ElMessage.error('请至少选择一条数据')
        return false
      }
    }
  }
  const headerRender = () => {
    return <Header {...{ onHandleOperate: (str: string) => handleOperate(str) }}>
      {{
        collapse: () => <HeaderSearch />
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

// 分配权限弹窗
</script>
