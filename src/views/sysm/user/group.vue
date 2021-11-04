<script lang="tsx">
import { defineComponent, reactive, ref, Ref } from 'vue'
import Header from '../components/public/header.vue'
import Table from './components/group/table'
import AddOrEditOrDel from './components/group/add'
import { dictionary } from '@/api/sysm/sysm'
import { listPage } from '@/api/sysm/group'
import { IGropListData, IDictionaryData } from '@/interface/sysm'
import { ElForm } from 'element-plus'
interface ITargrt {
  groupName: string
  groupTypeOrder: string
  statusOrder: string
  page: number
  size: number
}
export default defineComponent({
  components: {
    Header,
    Table
  },
  setup() {
    const target = reactive<ITargrt>({
      groupName: '',
      groupTypeOrder: '',
      statusOrder: '',
      page: 1,
      size: 10
    })
    const { dialogVisible, dialogRender, typeStr } = dialogAddOrEditEffet()
    const { tableRender, rows } = tableEffect(target, typeStr, dialogVisible)
    const { headerRender } = headerEffect(typeStr, dialogVisible)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            {headerRender(target)}
            {tableRender() }
            {dialogVisible.value ? dialogRender(rows as Ref<IGropListData>) : null}
          </>)
        }}
      </container>
    )
  }
})

const tableEffect = (target: ITargrt, typeStr: Ref<string>, dialogVisible: Ref<boolean>) => {
  const tableList = ref<IGropListData[]>([])
  const loading = ref<boolean>(false)
  const initTable = async () => {
    loading.value = true
    const { data: { records } } = await listPage(target, () => {
      loading.value = false
    })
    tableList.value = records
  }
  initTable()

  const rows = ref<IGropListData>()
  const handleOperation = (row: IGropListData, str: string) => {
    typeStr.value = str
    if (str !== 'delete') {
      dialogVisible.value = true
      rows.value = row
    }
  }

  const tableRender = () => {
    return <Table id="table3" tableList={tableList.value} loading={loading.value} {...{ onHandleOperation: handleOperation }} />
  }
  return { initTable, tableRender, rows }
}

// 顶部
const headerEffect = (typeStr: Ref<string>, dialogVisible:Ref<boolean>) => {
  const submitForm = () => {
    console.log(123)
  }
  const resetForm = () => {
    console.log(123)
  }
  const formRef = ref<InstanceType<typeof ElForm> | null>(null)
  const handleOperate = (str: string) => {
    if (str === 'add') {
      typeStr.value = str
      dialogVisible.value = true
    }
  }
  const headerRender = (target: ITargrt) => {
    return <Header {...{ onHandleOperate: (str: string) => handleOperate(str) }}>
      {{
        collapse: () => <>
          <el-form model={target} class="form-public-fff" ref={formRef} inline labelWidth={'100px'}>
            <el-row>
              <el-col span={5}>
                <el-form-item label="用户组名称">
                  <el-input vModel={target.groupName} size="mini" placeholder="请输入模块名称" />
                </el-form-item>
              </el-col>
              <el-col span={5}>
                <el-form-item label="是否启用">
                  <el-switch vModel={target.statusOrder} activeValue={1} size="mini" inactiveValue={0} />
                </el-form-item>
              </el-col>
              <el-col span={4}>
                <el-button type="primary" size="mini" onClick={submitForm}>查询</el-button>
                <el-button type="warning" size="mini" onClick={resetForm}>重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </>
      }}
    </Header>
  }
  return { headerRender }
}

// 新增和编辑以及详情
const dialogAddOrEditEffet = () => {
  const dialogVisible = ref<boolean>(false)
  const typeStr = ref<string>('add')
  const dictionaryList = ref<IDictionaryData[]>([])
  const initDictionary = async() => {
    const { data } = await dictionary({ dicCode: 'GroupType' })
    dictionaryList.value = data
  }
  initDictionary()

  const handleCancel = () => {
    dialogVisible.value = false
  }

  const dialogRender = (rows: Ref<IGropListData>) => {
    return <dialogComp
      width={'70vw'}
      title={typeStr.value === 'edit' ? '编辑' : typeStr.value === 'details' ? '详情' : '新增'}
      v-model={[dialogVisible.value, 'dialogVisible']}
    >
      {{
        main: () => <AddOrEditOrDel dictionaryList={dictionaryList.value} type={typeStr.value} row={rows.value} {...{ onHandleCancel: handleCancel }} />
      }}
    </dialogComp>
  }
  return { dialogVisible, dialogRender, typeStr }
}
</script>
