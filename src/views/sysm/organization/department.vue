<script lang="tsx">
import { defineComponent, reactive, ref, provide, Ref } from 'vue'
import Header from '../components/public/header.vue'
import HeaderSearch from './components/department/headerSearch'
import Table from './components/department/table'
import LeftTreeCompany from './components/department/leftTreeCompany'
import AddOrEditDialog from './components/department/dialogAddOrEditDel'
import { ElMessage } from 'element-plus'
import fileSaver from '@/utils/exportFile'
import { userGroupList } from '@/api/sysm/group'
import { listByTreeDept } from '@/api/sysm/department'
import { IGropListData } from '@/interface/sysm'

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
    const handleTreeNodeClick = (data: any) => {
      initTable({}, data.id)
    }
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<div class="flex">
            <div class="flex-left">
              <h1>公司</h1>
              <LeftTreeCompany {...{ onHandleTreeNodeClick: (data: any) => handleTreeNodeClick(data) }} />
            </div>
            <div class="flex-right">
              { headerRender(typeStr) }
              { tableRender() }
              { dialogVisible.value ? dialogRender(typeStr, id.value, initTable) : null}
            </div>
          </div>)
        }}
      </container>
    )
  }
})

// 表格
interface IForm {
  deptName?: string
  statusOrder?: number | null
  order?: number | null
  PId?: number | null
  companyIds?: number | null
  [key: string]: any
}
const useTableEffect = (dialogVisible: Ref<boolean>) => {
  const initData = reactive<IForm>({
    deptName: '',
    statusOrder: null,
    PId: null,
    incumbentFlag: null,
    companyIds: null
  })
  const loading = ref<boolean>(false)
  const tableList = ref([])
  const initTable = async(dataForm: IForm = {}, id?: number) => {
    id ? initData.companyIds = id : initData.companyIds = null
    loading.value = true
    if (Object.keys(dataForm).length > 0) {
      Object.keys(dataForm).forEach(key => {
        initData[key] = dataForm[key]
      })
    }
    const target = {
      ...initData
    }
    const { data } = await listByTreeDept(target, () => {
      loading.value = false
    })
    tableList.value = data
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
    </>
  }
  return { tableRender, typeStr, initData, id, initTable }
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
        main: () => <div>213</div>
      }}
    </dialogComp>
  }
  return { dialogRender, dialogVisible }
}
</script>

<style lang="scss" scoped>
.flex {
  @include flex-center(space-between, flex-start);
  &-left {
    flex: 0 0 20%;
  }
  &-right {
    flex: 0 0 78%;
  }
}
</style>
