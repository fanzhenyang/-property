import { defineComponent, reactive, inject, PropType, Ref, ref } from 'vue'
import { saveOrUpdate, detailById } from '@/api/sysm/user'
import { listPage } from '@/api/sysm/saff'
import { IGropListData } from '@/interface/sysm'
import { Ipagination } from '@/interface/public'
import { ElForm, ElTable } from 'element-plus'
type ElFormCtx = InstanceType<typeof ElForm>
type ElTableCtx = InstanceType<typeof ElTable>
const propsType = {
  strType: {
    type: String as unknown as PropType<Ref<string>>,
    default: 'add'
  },
  targetId: {
    type: Number,
    default: -1
  }
} as const
interface IFormData {
  account: string
  users: string
  email: string
  domainStatus: number
  status: number
  lockFlag: number
  groupIds: number[]
  id: number | null
  memo: string
  [x: string]: string | number | number[] | null
}
export default defineComponent({
  emits: ['handleDialogCancel', 'handleSubForm'],
  props: propsType,
  setup(props, { emit }) {
    const ruleForm = ref<ElFormCtx | null>(null)
    const disabled = ref<boolean>(false)
    const subLoading = ref<boolean>(false)
    const form = reactive<IFormData>({
      account: '',
      id: null,
      users: '',
      empId: 0,
      email: '',
      domainStatus: 0,
      status: 0,
      lockFlag: 0,
      memo: '',
      groupIds: []
    })
    const listGather = inject<Ref<IGropListData[]>>('UserGroupList')
    const subForm = async () => {
      if (listGather) {
        form.groupIds = listGather.value.filter(el => el.checkbox).map(el => el.id)
      }

      subLoading.value = true
      await saveOrUpdate({ ...form }, () => {
        subLoading.value = false
      }, props.strType.value)
      emit('handleSubForm')
    }
    const handleCancel = () => {
      emit('handleDialogCancel')
    }

    const initEditOrDetail = async () => {
      const { data } = await detailById(props.targetId)
      Object.keys(form).forEach(key => {
        if (key === 'users') {
          form.users = data.users[0].empName
        } else {
          form[key] = data[key]
        }
      })

      listGather && listGather.value.forEach((el: IGropListData) => {
        const i = data.groupIds.findIndex((id: number) => id === el.id)
        i === -1 ? el.checkbox = false : el.checkbox = true
      })
    }

    if (props.strType.value === 'details') {
      disabled.value = true
    } else {
      disabled.value = false
    }

    if (props.strType.value !== 'add') {
      initEditOrDetail()
    } else {
      listGather && listGather.value.forEach((el: IGropListData) => {
        el.checkbox = false
      })
    }

    const { initRenderPeople } = useEffectChangePeople(form)

    return () => (
      <>
        <el-form mode={form} ref={ruleForm} disabled={disabled.value} class="form-public-grey" labelWidth={'90px'}>
          <el-row gutter={20}>
            <el-col span={8}>
              <el-form-item label="????????????" prop='groupName'>
                <el-input vModel={form.account} size="mini" placeholder="????????????????????????" />
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item
                label="????????????"
                prop="users">
                <el-input vModel={form.users} readonly size="mini" placeholder="?????????????????????">
                  {{
                    suffix: () => <el-popover placement="bottom" width={'36vw'} trigger="click">
                      {{
                        default: () => initRenderPeople(),
                        reference: () => <el-button plan size="mini" type="text">??????</el-button>
                      }}
                    </el-popover>
                  }}
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item
                label="??????Email"
                prop="email">
                <el-input vModel={form.email} size="mini" placeholder="?????????????????????" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row gutter={20}>
            <el-col span={8}>
              <el-form-item
                label="AD?????????"
                prop="">
                <el-switch vModel={form.domainStatus} active-value={1} inactive-value={0} />
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item
                label="????????????"
                prop="">
                <el-switch vModel={form.status} active-value={1} inactive-value={0} />
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item
                label="????????????"
                prop="">
                <el-switch vModel={form.lockFlag} active-value={1} inactive-value={0} />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row gutter={20}>
            <el-col span={24}>
              <el-form-item
                label="???????????????"
                prop="dtDec">
                {initTableReder()}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row gutter={20}>
            <el-col span={24}>
              <el-form-item
                label="??????"
                prop="dtDec">
                <el-input vModel={form.memo} type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row gutter={20}>
          <el-col span={24} style={{ 'text-align': 'right' }}>
            {disabled.value ? null : <el-button type="primary" plain size="mini" loading={subLoading.value} onClick={() => subForm()}>??????</el-button>}
            <el-button plain size="mini" onClick={() => handleCancel()}>??????</el-button>
          </el-col>
        </el-row>
      </>)
  }
})
// ?????????????????????
const initTableReder = () => {
  const listGather = inject<Ref<IGropListData[]>>('UserGroupList')
  return (
    <el-table
      height={'20vh'}
      data={listGather?.value}
      row-key="id"
      border
    >
      <el-table-column label="???????????????" prop="groupType" width="160px" />
      <el-table-column label="???????????????">
        {{
          default: (scope: { row: IGropListData }) => {
            const { row } = scope
            return <el-checkbox vModel={row.checkbox} label={row.groupName} />
          }
        }}
      </el-table-column>
    </el-table>
  )
}
// ????????????
const useEffectChangePeople = (form: IFormData) => {
  const target = reactive({
    empCode: '',
    empName: ''
  })
  const pagination = reactive<Ipagination>({
    page: 1,
    size: 10,
    total: 0
  })
  const tableList = ref<any[]>([])
  const initPeopleList = async () => {
    const { data: { records, paginationPage } } = await listPage({
      ...target,
      ...pagination
    })
    tableList.value = records
    paginationPage && Object.keys(paginationPage).forEach(key => {
      pagination[key] = paginationPage[key]
    })
  }
  initPeopleList()

  const handlePaginationChange = (val: number, type: string) => {
    if (type === 'size') {
      pagination.size = val
      pagination.page = 1
    } else if (type === 'current') {
      pagination.page = val
    }
    initPeopleList()
  }
  const tableRef = ref<ElTableCtx | null>(null)
  const handleSelectionChange = (selection: any, row: any) => {
    if (!tableRef.value) {
      return false
    }
    // ??????????????????
    tableRef.value.clearSelection()
    // ????????????checkbox
    tableRef.value.toggleRowSelection(row, true)
    // ???????????????????????????
    form.empId = row.id
    form.users = row.empName
  }
  const handleReset = () => {
    target.empCode = ''
    target.empName = ''
    initPeopleList()
  }
  const initRenderPeople = () => {
    return (
      <>
        <el-form mode={form} labelWidth={'90px'}>
          <el-row>
            <el-col span={8}>
              <el-form-item label="????????????">
                <el-input vModel={target.empName} size="mini" placeholder="?????????????????????" />
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item label="????????????">
                <el-input vModel={target.empCode} size="mini" placeholder="?????????????????????" />
              </el-form-item>
            </el-col>
            <el-col span={8}>
              <el-form-item>
                <el-button size="mini" plan onClick={() => initPeopleList()}>??????</el-button>
                <el-button size="mini" plan onClick={() => handleReset()}>??????</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table row-key='id' ref={tableRef} data={tableList.value} height={'20vh'} onSelect={(selection: any, row: any) => handleSelectionChange(selection, row)}>
          <el-table-column type="selection" width="55" reserve-selection={true} />
          <el-table-column prop="companyName" label="????????????" />
          <el-table-column prop="deptName" label="????????????" />
          <el-table-column prop="empName" label="????????????" />
          <el-table-column prop="empCode" label="????????????" />
        </el-table>
        <paginationComp currentPage={pagination.page} pageSize={pagination.size} total={pagination.total} {...{ onHandlePaginationChange: handlePaginationChange }} />
      </>
    )
  }
  return { initRenderPeople }
}
