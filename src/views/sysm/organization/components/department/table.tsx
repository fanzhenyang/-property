import { defineComponent, readonly, toRefs, PropType, ref } from 'vue'
import { IGropListData } from '@/interface/sysm'
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
    // const { tableList, loading } = toRefs(props)
    const handleOperation = (row: any, strType: string) => {
      emit('handleOperation', row, strType)
    }
    const columnData = ref([
      { label: '部门名称', prop: 'deptName', align: 'left', width: '160px' },
      { label: '部门简介', prop: 'shortName', width: '100px' },
      { label: '部门编号', prop: 'deptCode', tooltip: true },
      { label: '排序号', prop: 'orderNo', tooltip: true, width: '80px' },
      { label: '部门上级主管', prop: 'pManagerName', tooltip: true, width: '120px' },
      { label: '部门主管', prop: 'managerName', tooltip: true, width: '120px' },
      { label: '启停状态', prop: 'status', template: true, width: '80px' },
      { label: '操作', prop: 'assignPermissions', template: true, width: '210px' }
    ])
    const checkList = readonly<string[]>(['用户组分类', '用户组名称', '所属模块', '用户组描述', '启停状态', '分配权限'])

    const handleSelect = (type: string, list: IGropListData[]) => {
      const ids = list.map(el => el.id).toString()
      emit('handleTableSelect', ids)
    }
    return () => <>
      <tableComp
        id={props.id}
        vLoading={props.loading}
        data={props.tableList}
        isSelection={true}
        rowKey={'id'}
        height={'84vh'}
        width={'100%'}
        columnData={columnData.value}
        {...{ onHandleSelect: handleSelect }}
      >
        {{
          status: (row: any) => (<>
            {row.status === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt="" />}
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
