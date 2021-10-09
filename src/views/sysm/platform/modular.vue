<script lang="tsx">
import { defineComponent, reactive, readonly, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { list, listByTree } from '@/api/sysm/sysm'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import Header from './components/header.vue'
import FormSearch from './components/modular/formSearch.vue'
import { IColumn } from '@/components/public/TableComp/index.vue'
interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
  selectList: IPlatformTree[]
}
export default defineComponent({
  setup () {
    const listGather: listData = reactive({
      platformList: [],
      parentTree: [],
      selectList: []
    })
    // const selectList = ref([])
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
      initImg(listGather.parentTree)
    }

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

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <Header { ...{ onHandleOperate: (type: string) => handleOperate(type, listGather) } } >
            {{ collapse: () => <FormSearch listGather={listGather as listData} {...{ onSubmitSearchForm: submitSearchForm }} /> }}
          </Header>
          {tableCbs(listGather)}
        </>)
      }}

    </container>
  }
})
// 点击顶部按钮
const handleOperate = (type: string, targetList: listData) => {
  console.log('%c 🥩 list: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', targetList.selectList)
  if (type === 'delete') {
    if (targetList.selectList.length === 0) {
      ElMessage.error({
        message: '请至少选择一条数据',
        type: 'error'
      })
    }
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

// 表格的
const tableCbs = (targetList: listData) => {
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
  const handleDelete = (row: any) => {
    console.log('%c 🍖 scope: ', 'font-size:20px;background-color: #465975;color:#fff;', row)
  }
  watch(() => checkData.value, (val) => {
    columnData.value.forEach(item => {
      if (val.includes(item.label) || item.prop === 'operation') {
        item.ispass = true
      } else {
        item.ispass = false
      }
    })
  }, { deep: true })
  const tableRef = ref(null)
  const handleSelect = (type: string, list: IPlatformTree[]) => {
    targetList.selectList = list
  }
  return (
    <tableComp
      data={targetList.parentTree}
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
        operation: (scope: IPlatformTree) => (<>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text" style={{ color: 'red' }}>删除</el-button>
        </>)
      }}
    </tableComp>
  )
}
</script>
