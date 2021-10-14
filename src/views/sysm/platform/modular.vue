<script lang="tsx">
import { defineComponent, reactive, readonly, ref, watch, Ref } from 'vue'
import { list, listByTree } from '@/api/sysm/sysm'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import { treeList } from '@/api/act/act'
import { TreeList } from '@/interface/act'
import { IColumn } from '@/components/public/TableComp/index.vue'
import { ElMessage } from 'element-plus'
import Header from './components/header.vue'
import FormSearch from './components/modular/formSearch.vue'
import DialogDetele from './components/public/dialogDetele.vue'
import AddOrEditOrDel from './components/modular/addOrEditOrDel.vue'
interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
  treeList?: TreeList[]
}
export default defineComponent({
  setup () {
    const listGather: listData = reactive({
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

    // 获取所属平台对应menu
    const initParentTree = async () => {
      const { data } = await listByTree(null)
      listGather.parentTree = data
      initImg(listGather.parentTree)
    }

    // 获取流程
    const flow = async () => {
      const { data } = await treeList(null)
      listGather.treeList = data.children
    }
    flow()

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

    // 删除
    const isDetele = ref(false)
    const ids = ref<string | number>('')

    // 新增，编辑，详情
    const isAddOrEditOrDel = ref<boolean>(false)

    return () => <container imgIndex={1} >
      {{
        cont: () => (<>
          <Header { ...{ onHandleOperate: (type: string) => handleOperate(type, ids, isDetele, isAddOrEditOrDel) } } >
            {{ collapse: () => <FormSearch listGather={listGather as listData} {...{ onSubmitSearchForm: submitSearchForm }} /> }}
          </Header>
          {tableCbs(listGather, isDetele, ids)}
          {isDetele.value ? deteleComp(isDetele, ids) : null}
          {isAddOrEditOrDel.value ? addOrEditOrDelComp(isAddOrEditOrDel, listGather) : null}
        </>)
      }}

    </container>
  }
})
// 点击顶部按钮
const handleOperate = (type: string, ids: Ref<string | number>, isDetele: Ref<boolean>, isAddOrEditOrDel: Ref<boolean>) => {
  if (type === 'delete') {
    if (!ids.value) {
      ElMessage.error({
        message: '请至少选择一条数据',
        type: 'error'
      })
      return false
    }
    isDetele.value = true
    return true
  } else if (type === 'add') {
    isAddOrEditOrDel.value = true
    return true
  }
}

// 新增，编辑，和详情
const addOrEditOrDelComp = (isBool: Ref<boolean>, listGather: listData) => {
  console.log('%c 🌽 isAddOrEditOrDel: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', isBool.value)
  return (
    <DialogDetele
      title="新增"
      width={'70vw'}
      v-model={[isBool.value, 'dialogVisible']}
    >
      {{
        main: () => <AddOrEditOrDel listGather={listGather} />
      }}
    </DialogDetele>
  )
}

// 删除
const handleDetele = (ids: Ref<string | number>) => {
  console.log('%c 🍥 id: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', ids.value)
}
const handleClose = (bool: Ref<boolean>, ids: Ref<string | number>) => {
  bool.value = false
  ids.value = ''
}
const deteleComp = (bool: Ref<boolean>, ids: Ref<string | number>) => {
  return <DialogDetele
    title="提示"
    v-model={[bool.value, 'dialogVisible']}
  >
    {{
      main: () => <div>确定删除?</div>,
      footer: () => <span class="dialog-footer">
        <el-button size="mini" onClick={() => handleClose(bool, ids)}>取 消</el-button>
        <el-button size="mini" type="primary" onClick={() => handleDetele(ids)}>确 定</el-button>
      </span>
    }}

  </DialogDetele>
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

// 表格
const tableCbs = (targetList: listData, isDetele:Ref<boolean>, ids:Ref<string | number>) => {
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
    isDetele.value = true
    ids.value = row.id
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
    ids.value = list.map(el => el.id).toString()
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
        operation: (row: IPlatformTree) => (<>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text" style={{ color: 'red' }} onClick={() => handleDelete(row)}>删除</el-button>
        </>)
      }}
    </tableComp>
  )
}
</script>
