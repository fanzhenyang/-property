<script lang="tsx">
import { defineComponent, reactive, readonly } from 'vue'
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

    return () => <>
      <Header { ...{ onHandleOperate: handleOperate } } >
        {{ collapse: () => <FormSearch listGather={listGather as listData} {...{ onSubmitSearchForm: submitSearchForm }} /> }}
      </Header>
      {tableCbs(listGather.parentTree)}
    </>
  }
})
// 点击顶部按钮
const handleOperate = (type: string) => {
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
  const columnData: IColumn[] = [
    { label: '模块名称', prop: 'moduleName' },
    { label: '模块路径', prop: 'url', tooltip: true },
    { label: '排序号', prop: 'orderNo' },
    { label: '备注', prop: 'memo', tooltip: true },
    { label: '启停状态', prop: 'status' },
    { label: '模块图标', prop: 'logo' },
    { label: '编制人员', prop: 'createUser' },
    { label: '编制时间', prop: 'createTime' },
    { label: '操作', prop: 'operation', template: true }
  ]
  const treeProps = readonly({
    children: 'children'
  })
  return (
    <tableComp data={tableList} treeProps={treeProps} defaultxpandAll={true} isSelection={true} rowKey={'id'} columnData={columnData}>

    </tableComp>
  )
}
</script>
