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
    const { tableRender, initTable, checkList } = useTableEffect()
    const { headerRender } = useHeaderEffect(checkList)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            { headerRender() }
            { tableRender() }
          </>)
        }}
      </container>
    )
  }
})
const useTableEffect = () => {
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
  const handleOperation = (row: IGropListData, str: string) => {
    if (str === 'edit') {
      // typeStr.value = str
      // dialogVisible.value = true
    } else if (str === 'delete') {
      // deleteShow.value = true
    }
  }
  const checkList = ref<number>(0)
  const handleTableSelect = (id: number) => {
    checkList.value = id
  }
  const tableRender = () => {
    return <Table id={'table3'} tableList={tableList.value} loading={loading.value} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
  }
  return { tableRender, initTable, checkList }
}

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
</script>
