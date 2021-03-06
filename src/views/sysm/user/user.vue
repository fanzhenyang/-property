<script lang="tsx">
import { defineComponent, reactive, ref, provide, Ref } from 'vue'
import Header from '../components/public/header.vue'
import HeaderSearch from './components/user/headerSearch'
import Table from './components/user/table'
import AddOrEditDialog from './components/user/dialogAddorEdit'
import { ElMessage } from 'element-plus'
import fileSaver from '@/utils/exportFile'
import { userGroupList } from '@/api/sysm/group'
import { listPage } from '@/api/sysm/user'
import { IGropListData } from '@/interface/sysm'
import { Ipagination } from '@/interface/public'

export default defineComponent({
  setup() {
    const userGroupSelectList = ref<IGropListData[]>([])
    provide<Ref<IGropListData[]>>('UserGroupList', userGroupSelectList)
    const initUserGroupList = async() => {
      const { data } = await userGroupList(null)
      data.forEach((el: IGropListData) => {
        if (!el.groupType) {
          el.groupType = '未命名'
        }
        el.checkbox = false
      })
      userGroupSelectList.value = data
    }
    initUserGroupList()

    const { dialogRender, dialogVisible } = useAddOrEditEffect()
    const { headerRender } = useHeaderEffect(dialogVisible)
    const { tableRender, typeStr, id, initTable } = useTableEffect(dialogVisible)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            { headerRender(typeStr) }
            { tableRender() }
            { dialogVisible.value ? dialogRender(typeStr, id.value, initTable) : null}
          </>)
        }}
      </container>
    )
  }
})

// 表格
interface IForm {
  account?: string
  status?: number | null
  lockFlag?: number | null
  incumbentFlag?: number | null
  groupId?: number | null
  [key: string]: any
}
const useTableEffect = (dialogVisible: Ref<boolean>) => {
  const pagination = reactive<Ipagination>({
    page: 1,
    size: 10,
    total: 0
  })
  const initData = reactive<IForm>({
    account: '',
    status: null,
    lockFlag: null,
    incumbentFlag: null,
    groupId: null
  })
  const loading = ref<boolean>(false)
  const tableList = ref([])
  const initTable = async(dataForm: IForm = {}) => {
    loading.value = true
    if (Object.keys(dataForm).length > 0) {
      Object.keys(dataForm).forEach(key => {
        initData[key] = dataForm[key]
      })
    }
    const target = {
      ...pagination,
      ...initData
    }
    const { data: { paginationPage, records } } = await listPage(target, () => {
      loading.value = false
    })
    tableList.value = records
    paginationPage && Object.keys(paginationPage).forEach(key => {
      pagination[key] = paginationPage[key]
    })
  }
  initTable()

  const typeStr = ref<string>('add')
  const id = ref<number>(-1)
  const handleOperation = (row: any, type: string) => {
    typeStr.value = type
    if (type !== 'delete') {
      dialogVisible.value = true
    }
    id.value = row.id
  }
  const tableRender = () => {
    return <>
      <Table id={'table3'} loading={loading.value} tableList={tableList.value} {...{ onHandleOperation: handleOperation }} />
      <paginationComp currentPage={pagination.page} pageSize={pagination.size} total={pagination.total} {...{ onHandlePaginationChange: handlePaginationChange }} />
    </>
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
  return { tableRender, typeStr, id, initTable }
}

// 顶部按钮
const useHeaderEffect = (dialogVisible: Ref<boolean>) => {
  const handleOperate = (str: string, typeStr: Ref<string>) => {
    if (str === 'add') {
      typeStr.value = 'add'
      dialogVisible.value = true
      return true
    } else if (str === 'delete') {
      // if (!checkList.value) {
      ElMessage.error('请至少选择一条数据')
      //   return false
      // }
      // deleteShow.value = true
      return true
    } else if (str === 'export') {
      fileSaver.exportExcel('#table3', '用户组分类', 'application/octet-stream')
    }
  }
  const headerSubmitFrom = () => {
    console.log(555)
  }
  const headerRender = (typeStr: Ref<string>) => {
    return <Header {...{ onHandleOperate: (str: string) => handleOperate(str, typeStr) }}>
      {{
        collapse: () => <HeaderSearch {...{ onHeaderSubmitFrom: () => headerSubmitFrom() }} />
      }}
    </Header>
  }
  return { headerRender }
}

// 新增，编辑，详情弹窗
const useAddOrEditEffect = () => {
  const dialogVisible = ref<boolean>(false)
  const handleDialogCancel = () => {
    dialogVisible.value = false
  }
  const handleSubForm = (cbs: () => void) => {
    handleDialogCancel()
    cbs()
  }
  const dialogRender = (typeStr: Ref<string>, id: number, cbs: () => void) => {
    return <dialogComp
      width={'70vw'}
      title={typeStr.value === 'edit' ? '编辑' : typeStr.value === 'details' ? '详情' : '新增'}
      v-model={[dialogVisible.value, 'dialogVisible']}
    >
      {{
        main: () => <AddOrEditDialog targetId={id} strType={typeStr} {...{ onHandleDialogCancel: handleDialogCancel, onHandleSubForm: () => handleSubForm(cbs) }} />
      }}
    </dialogComp>
  }
  return { dialogRender, dialogVisible }
}
</script>
