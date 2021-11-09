import { defineComponent, ref, readonly, reactive, PropType } from 'vue'
import { IGropListData } from '@/interface/sysm'
import { permission } from '@/api/sysm/group'
export default defineComponent({
  props: {
    row: {
      type: Object as PropType<IGropListData>,
      default: () => ({})
    },
    id: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const columnData = readonly([
      { label: '功能模块名称', prop: 'moduleName', width: '260px' },
      { label: '所属平台', prop: 'platformName', tooltip: true, width: '120px' },
      { label: '全选', prop: 'checkAll', template: true, width: '80px' },
      { label: '功能操作名称编码', prop: 'actionList', template: true }
    ])
    const treeProps = readonly({
      children: 'children',
      id: 'id'
    })

    const initData = async () => {
      const { data } = await permission({
        groupId: props.row.id,
        platformId: ''
      })
      tableList.value = data
      console.log('%c 🍼️ data: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', data)
    }
    initData()

    const tableList = ref<any[]>([])
    const handleSelect = (val: any) => {
      console.log(val)
    }

    return () => (
      <tableComp
        id={props.id}
        data={tableList.value}
        treeProps={treeProps}
        class={'table-black'}
        defaultExpandpandAll={true}
        isIndex={true}
        rowKey={'id'}
        columnData={columnData}
        {...{ onHandleSelect: handleSelect }}
      >
        {{
          checkAll: (row: any) => (<div>
            <el-checkbox></el-checkbox>
          </div>),
          actionList: (row: any) => (<div>
            {
              row.actionList.map((el: any) => {
                return <div key={el.id}>
                  <el-checkbox></el-checkbox>
                  <b>{el.actionName}</b>
                  <span>({el.description})</span>
                </div>
              })
            }
          </div>)
        }}
      </tableComp>
    )
  }
})
