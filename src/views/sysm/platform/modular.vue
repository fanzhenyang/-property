<script lang="tsx">
import { defineComponent, reactive, readonly, ref } from 'vue'
import { list, listByTree } from '@/api/sysm/sysm'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import Header from './components/header.vue'
import FormSearch from './components/modular/formSearch.vue'
import { IColumn } from '@/components/public/TableComp/index.vue'
interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
}
export default defineComponent({
  setup () {
    const listGather: listData = reactive({
      platformList: [],
      parentTree: []
    })
    // 异步获取所属平台
    const initPlatform = async () => {
      const { data } = await list(null)
      listGather.platformList = data
      initParentTree()
    }
    initPlatform()

    // 获取所属平台对应menu
    const initParentTree = async () => {
      const { data } = await listByTree(null)
      listGather.parentTree = data
    }

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <Header { ...{ onHandleOperate: handleOperate } } >
            {{ collapse: () => <FormSearch listGather={listGather as listData} {...{ onSubmitSearchForm: submitSearchForm }} /> }}
          </Header>
          {tableCbs(listGather.parentTree)}
        </>)
      }}

    </container>
  }
})
// 点击顶部按钮
const handleOperate = (type: string) => {
  if (type === 'delete') {

  }
  console.log('%c 🍸 type: ', 'font-size:20px;background-color: #4b4b4b;color:#fff;', type)
}

// 搜索
interface IformSearch {
  moduleName: string
  status: number
  platformId: number
  PId: number
}
const submitSearchForm = (form: IformSearch) => {
  console.log('%c 🥫 form: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', form)
}

const tableCbs = (tableList: IPlatformTree[]) => {
  const checkList = readonly<string[]>(['模块名称', '模块路径', '排序号', '备注', '启停状态', '模块图标', '编制人员', '编制时间'])
  console.log('%c 🥃 checkList: ', 'font-size:20px;background-color: #3F7CFF;color:#fff;', checkList)
  const checkData = ref('')
  const columnData: IColumn[] = [
    { label: '模块名称', prop: 'moduleName' },
    { label: '模块路径', prop: 'url', tooltip: true },
    { label: '排序号', prop: 'orderNo' },
    { label: '备注', prop: 'memo', tooltip: true },
    { label: '启停状态', prop: 'status' },
    { label: '模块图标', prop: 'logo', tooltip: true },
    { label: '编制人员', prop: 'createUser' },
    { label: '编制时间', prop: 'createTime' },
    { label: '操作', prop: 'operation', template: true, templateHeader: true }
  ]
  const treeProps = readonly({
    children: 'children'
  })
  const handleDelete = (row: any) => {
    console.log('%c 🍖 scope: ', 'font-size:20px;background-color: #465975;color:#fff;', row)
  }
  return (
    <tableComp data={tableList} treeProps={treeProps} defaultExpandpandAll={true} isSelection={true} rowKey={'id'} columnData={columnData}>
      {{
        operationHeader: () => (
          <el-dropdown hide-on-click={false} vSlots={{
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
        operation: (scope: any) => (<>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text" style={{ color: 'red' }}>删除</el-button>
        </>)
      }}
    </tableComp>
  )
}
</script>
