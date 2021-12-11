import { defineComponent, readonly, toRefs, PropType, ref } from 'vue'
import { IGropListData } from '@/interface/sysm'
import { resetPwd } from '@/api/user'
// import { IColumn } from '@/components/public/TableComp/index.vue'
const propsType = {
  tableList: {
    type: Array as PropType<IGropListData[]>,
    default: () => ([])
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
} as const
export default defineComponent({
  emits: ['handleOperation', 'handleTableSelect'],
  props: propsType,
  setup(props, { emit }) {
    const handleOperation = (row: any, strType: string) => {
      emit('handleOperation', row, strType)
    }
    const columnData = ref([
      { label: '用户账号', prop: 'account', align: 'left', width: '120px' },
      { label: '用户名称', prop: 'empName', width: '120px' },
      { label: '所属部门', prop: 'deptName', tooltip: true },
      { label: '所属用户组', prop: 'groupName', tooltip: true },
      { label: '企业Email', prop: 'email', tooltip: true, width: '120px' },
      { label: '启停状态', prop: 'status', template: true, width: '80px' },
      { label: '锁定状态', prop: 'lockFlag', template: true, width: '210px' },
      { label: 'AD域客户状态', prop: 'domainStatus', template: true, width: '210px' },
      { label: '是否在职', prop: 'onDutyFlag', template: true },
      { label: '重置密码', prop: 'password', template: true, width: '210px' },
      { label: '操作', prop: 'assignPermissions', template: true, width: '210px' }
    ])
    const checkList = readonly<string[]>(['用户组分类', '用户组名称', '所属模块', '用户组描述', '启停状态', '分配权限'])

    const handleSelect = (type: string, list: IGropListData[]) => {
      const ids = list.map(el => el.id).toString()
      emit('handleTableSelect', ids)
    }
    const handleResetPassword = async (row: any) => {
      const { data } = await resetPwd(row.id, () => { console.log(123) })
    }
    return () => <>
      <tableComp
        id={props.id}
        vLoading={props.loading}
        data={props.tableList}
        isSelection={true}
        rowKey={'id'}
        columnData={columnData.value}
        {...{ onHandleSelect: handleSelect }}
      >
        {{
          status: (row: any) => (<>
            {row.status === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt="" />}
          </>),
          lockFlag: (row: any) => (<>
            {row.lockFlag === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt="" />}
          </>),
          domainStatus: (row: any) => (<>
            {row.domainStatus === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt="" />}
          </>),
          onDutyFlag: (row: any) => (<>
            {row.onDutyFlag === 1 ? '在职' : '离职'}
          </>),
          password: (row: any) => (<>
            <el-popconfirm title={`确定重置${row.account}的密码吗？`}
              onConfirm={() => handleResetPassword(row)}
            >
              {{
                reference: () => <el-button plan type="text" >重置密码</el-button>
              }}
            </el-popconfirm>
          </>),
          assignPermissionsHeader: () => (<>
            <el-dropdown hide-on-click={false}
              vSlots={{
                dropdown: () => <el-dropdown-menu>
                  <el-checkbox-group >
                    {
                      checkList.map(check => {
                        return <el-dropdown-item key={check}>
                          <el-checkbox label={check} key={check} />
                        </el-dropdown-item>
                      })
                    }
                  </el-checkbox-group>
                </el-dropdown-menu>
              }}>
              <span>
                操作<i class="el-icon-s-operation columnSetIco" />
              </span>
            </el-dropdown>
          </>),
          assignPermissions: (row: IGropListData) => (<>
            <el-button type="text" onClick={() => handleOperation(row, 'details')}>查看</el-button>
            <el-button type="text" onClick={() => handleOperation(row, 'edit')}>编辑</el-button>
            <el-button type="text" style={{ color: 'red' }} onClick={() => handleOperation(row, 'delete')}>删除</el-button>
          </>)
        }}
      </tableComp>
    </>
  }
})
