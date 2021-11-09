<script lang="tsx">
import { defineComponent, reactive, ref, Ref } from 'vue'
import Header from '../components/public/header.vue'
import Table from './components/group/table'
import AddOrEditOrDel from './components/group/dialogAddOrEditDel'
import DialogTable from './components/group/dialogTable'
import { dictionary } from '@/api/sysm/sysm'
import { listPage, deleteById } from '@/api/sysm/group'
import { IGropListData, IDictionaryData } from '@/interface/sysm'
import { ElForm, ElMessage } from 'element-plus'
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
    const { dialogVisible, dialogRender, typeStr, addWatchFunc } = dialogAddOrEditEffect()
    const { deleteRender, deleteShow, wacthData } = dialogDeleteEffect()
    const { tableRender, rows, initTable } = tableEffect(target, typeStr, dialogVisible, deleteShow, wacthData)
    addWatchFunc(initTable)
    const { headerRender } = headerEffect(typeStr, dialogVisible, deleteShow)
    return () => (
      <container imgIndex={1} >
        {{
          cont: () => (<>
            {headerRender(target)}
            {tableRender() }
            {dialogVisible.value ? dialogRender(rows as Ref<IGropListData>) : null}
            {deleteShow.value ? deleteRender() : null}
          </>)
        }}
      </container>
    )
  }
})

// 表格
const tableEffect = (target: ITargrt, typeStr: Ref<string>, dialogVisible: Ref<boolean>, deleteShow: Ref<boolean>, wacthData:(num: number, cbs: () => Promise<void>) => void) => {
  const tableList = ref<IGropListData[]>([])
  const loading = ref<boolean>(false)
  const ids = ref<number>(-2)
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
    } else if (str === 'delete') {
      deleteShow.value = true
      wacthData(row.id, initTable)
    }
  }

  const handleTableSelect = (id: number) => {
    ids.value = id
    wacthData(ids.value, initTable)
  }

  const tableRender = () => {
    return <Table id="table3" tableList={tableList.value} loading={loading.value} {...{ onHandleOperation: handleOperation, onHandleTableSelect: handleTableSelect }} />
  }
  return { initTable, tableRender, rows, ids }
}

// 顶部
const headerEffect = (typeStr: Ref<string>, dialogVisible:Ref<boolean>, deleteShow: Ref<boolean>) => {
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
    } else if (str === 'delete') {
      // deleteShow.value = true
      ElMessage.error({
        message: '请至少选择一条数据',
        type: 'error'
      })
      return false
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
const dialogAddOrEditEffect = () => {
  const dialogVisible = ref<boolean>(false)
  const typeStr = ref<string>('add')
  const dictionaryList = ref<IDictionaryData[]>([])
  const initDictionary = async() => {
    const { data } = await dictionary({ dicCode: 'GroupType' })
    dictionaryList.value = data
  }
  initDictionary()

  const handleDialogCancel = () => {
    dialogVisible.value = false
  }
  let func: any
  const addWatchFunc = (cbs: () => void) => {
    func = cbs
  }

  const successFunc = () => {
    func && func()
    handleDialogCancel()
  }

  const dialogRender = (rows: Ref<IGropListData>) => {
    return <dialogComp
      width={'70vw'}
      title={typeStr.value === 'edit' ? '编辑' : typeStr.value === 'details' ? '详情' : typeStr.value === 'assign' ? '分配权限' : '新增'}
      v-model={[dialogVisible.value, 'dialogVisible']}
    >
      {{
        main: () => typeStr.value !== 'assign' ? <AddOrEditOrDel dictionaryList={dictionaryList.value} type={typeStr.value} row={rows.value} {...{ onHandleDialogCancel: handleDialogCancel, onSuccessFunc: successFunc }} /> : <DialogTable row={rows.value} id={'tableDialog'} />
      }}
    </dialogComp>
  }
  return { dialogVisible, dialogRender, typeStr, addWatchFunc }
}

// 删除
const dialogDeleteEffect = () => {
  const deleteShow = ref<boolean>(false)
  const loading = ref<boolean>(false)
  let ids = -2

  const handleCancel = () => {
    deleteShow.value = false
  }

  let func: any
  const wacthData = (num: number, cbs: () =>Promise<void>) => {
    ids = num
    func = cbs
  }
  const handleDelete = async() => {
    loading.value = true
    await deleteById(ids, () => {
      loading.value = false
    })
    deleteShow.value = false
    func && func()
  }
  const deleteRender = () => {
    return <dialogComp title="提示" width={'14vw'} v-model={[deleteShow.value, 'dialogVisible']}>
      {{
        main: () => <div>确定删除这条数据吗？</div>,
        footer: () => <div>
          <el-button type="warning" plain size="mini" loading={loading.value} onClick={handleDelete}>确定</el-button>
          <el-button plain size="mini" onClick={() => handleCancel()}>取消</el-button>
        </div>
      }}
    </dialogComp>
  }

  return { deleteRender, handleDelete, deleteShow, wacthData }
}
</script>
