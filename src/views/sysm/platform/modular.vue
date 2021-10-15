<script lang="tsx">
import { defineComponent, reactive, readonly, ref, watch, Ref, watchEffect } from 'vue'
import { list, listByTree, deleteById } from '@/api/sysm/sysm'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import { treeList } from '@/api/act/act'
import { TreeList } from '@/interface/act'
import { IColumn } from '@/components/public/TableComp/index.vue'
import { ElMessage } from 'element-plus'
import Header from './components/header.vue'
import FormSearch from './components/modular/formSearch.vue'
import Dialog from './components/public/dialog.vue'
import AddOrEditOrDel from './components/modular/addOrEditOrDel.vue'
interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
  treeList?: TreeList[]
}
export default defineComponent({
  setup (props, { emit }) {
    const listGather = reactive<listData>({
      platformList: [],
      parentTree: [],
      treeList: []
    })
    // 异步获取所属平台
    const initPlatform = async () => {
      const { data } = await list(null)
      listGather.platformList = data
      initParentTree()
    }
    initPlatform()

    // 获取表格数据
    const tabLoading = ref<boolean>(false)
    const initParentTree = async () => {
      tabLoading.value = true
      const { data } = await listByTree(null, () => {
        tabLoading.value = false
      })
      listGather.parentTree = data
    }

    // 获取流程
    const flow = async () => {
      const { data } = await treeList(null)
      listGather.treeList = data.children
    }
    flow()

    return () => <container imgIndex={1}
      vSlots={{
        cont: () => (<>
          <TableView listGather={listGather}/>
        </>)
      }}

    >
    </container>
  }
})

// 表格
const TableView = ({ ...props }) => {
  console.log('%c 🥘 props: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', props)
  console.log('zhixing')
  // const { listGather } = props
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
  // initImg(props.listGather.parentTree)
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
  const treeProps = readonly({
    children: 'children',
    id: 'id'
  })
  const handleDelete = (row: IPlatformTree) => {
    console.log(123)
  }
  const handleOperation = (row: IPlatformTree, type: string) => {
    console.log(456)
  }
  // watch(() => checkData.value, (val) => {
  //   columnData.value.forEach(item => {
  //     if (val.includes(item.label) || item.prop === 'operation') {
  //       item.ispass = true
  //     } else {
  //       item.ispass = false
  //     }
  //   })
  // }, { deep: true })
  const tableRef = ref(null)
  const handleSelect = (type: string, list: IPlatformTree[]) => {
    // ids.value = list.map(el => el.id).toString()
  }
  return (
    <tableComp
      data={props.listGather.parentTree}
      tableRef={tableRef}
      treeProps={treeProps}
      isSelection={true}
      rowKey={'id'}
      defaultExpandpandAll={true}
      columnData={columnData.value}
    >
      {{
        // {...{ onHandleSelect: handleSelect }}
        status: (row: IPlatformTree) => (<>
          {row.status === 1 ? <img src={require('@/assets/img/icons/open.png')} alt="" /> : <img src={require('@/assets/img/icons/close.png')} alt=""/>}
        </>),
        logoUrl: (row: IPlatformTree) => (<>
          {row.logoUrl ? <img src={row.logoUrl as string} alt="" style={{ width: '3rem' }} /> : '暂无' }
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
          <el-button type="text" style={{ color: 'red' }} onClick={() => handleDelete(row)}>删除</el-button>
        </>)
      }}
    </tableComp>
  )
}
</script>
