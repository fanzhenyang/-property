<script lang="tsx">
import { defineComponent, readonly, computed, ref, watch, inject } from 'vue'
import { IColumn } from '@/components/public/TableComp/index.vue'
import { listData } from '../../modular.vue'
import { IPlatformTree } from '@/interface/sysm'
export default defineComponent({
  emits: ['handleOperation', 'handleTableSelect'],
  props: ['id'],
  setup (props, { emit }) {
    const checkList = readonly<string[]>(['模块名称', '模块路径', '排序号', '备注', '启停状态', '模块图标', '编制人员', '编制时间'])
    const checkData = ref<string[]>(['模块名称', '模块路径', '排序号', '备注', '启停状态', '模块图标', '编制人员', '编制时间'])
    const columnData = ref<IColumn[]>([
      { label: '模块名称', prop: 'moduleName', ispass: true, align: 'left', width: '240px ' },
      { label: '模块路径', prop: 'url', tooltip: true, ispass: true },
      { label: '排序号', prop: 'orderNo', ispass: true },
      { label: '备注', prop: 'memo', tooltip: true, ispass: true },
      { label: '启停状态', prop: 'status', ispass: true, template: true },
      { label: '模块图标', prop: 'logoUrl', ispass: true, template: true },
      { label: '编制人员', prop: 'createUser', ispass: true },
      { label: '编制时间', prop: 'createTime', ispass: true },
      { label: '操作', prop: 'operation', template: true, templateHeader: true }
    ])
    const tableRef = ref<any>(null)
    const treeProps = readonly({
      children: 'children',
      id: 'id'
    })
    watch(() => checkData.value, (val) => {
      columnData.value.forEach(item => {
        if (val.includes(item.label) || item.prop === 'operation') {
          item.ispass = true
        } else {
          item.ispass = false
        }
      })
    }, { deep: true })
    // 获取到表格数据
    const tableList = inject<listData>('listData')

    const tbaleData = computed(() => {
      tableList?.parentTree && initImg(tableList.parentTree)
      return tableList?.parentTree
    })

    // 点击表格操作按钮
    const handleOperation = (row: IPlatformTree, type: string) => {
      emit('handleOperation', row, type)
    }

    // 点击checkbox
    const handleSelect = (type: string, list: IPlatformTree[]) => {
      const ids = list.map(el => el.id).toString()
      emit('handleTableSelect', ids)
    }
    return () => <>
      <tableComp
        id={props.id}
        data={tbaleData.value}
        tableRef={tableRef}
        treeProps={treeProps}
        defaultExpandpandAll={true}
        isSelection={true}
        rowKey={'id'}
        columnData={columnData.value}
        {...{ onHandleSelect: handleSelect }}
      >

        {{
          status: (row: IPlatformTree) => (<>
            {row.status === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt=""/>}
          </>),
          logoUrl: (row: IPlatformTree) => (<>
            {row.logoUrl && <img src={row.logoUrl as string} alt="" style={{ width: '3rem' }} /> }
          </>),
          operationHeader: () => (
            <el-dropdown hide-on-click={false}
              vSlots={{
                dropdown: () => <el-dropdown-menu>
                  <el-checkbox-group vModel={checkData.value}>
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
              操作<i class="el-icon-s-operation columnSetIco"/>
              </span>
            </el-dropdown>
          ),
          operation: (row: IPlatformTree) => (<>
            <el-button type="text" onClick={() => handleOperation(row, 'details')}>查看</el-button>
            <el-button type="text" onClick={() => handleOperation(row, 'edit')}>编辑</el-button>
            <el-button type="text" style={{ color: 'red' }} onClick={() => handleOperation(row, 'delete')}>删除</el-button>
          </>)
        }}
      </tableComp>
    </>
  }
})

// 处理图片
const initImg = (list: IPlatformTree[]) => {
  list.forEach((item: IPlatformTree) => {
    if (item.logo) {
      item.logoUrl = `${process.env.VUE_APP_BASE_API}sysm/files/download?fileUrl=${item.logo}`
    }
    if (item.children && item.children.length > 0) {
      initImg(item.children)
    }
  })
}
</script>
