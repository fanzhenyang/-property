import { defineComponent, ref, readonly, PropType } from 'vue'
import { IGropListData, IActive } from '@/interface/sysm'
import { permission, actionSaveUpdate } from '@/api/sysm/group'
import './style/dialogTable.scss'
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
      { label: '功能模块名称', prop: 'moduleName', align: 'left', width: '260px' },
      { label: '所属平台', prop: 'platformName', tooltip: true, width: '120px' },
      { label: '全选', prop: 'checkAllFlag', template: true, width: '80px' },
      { label: '功能操作名称编码', prop: 'actionList', template: true }
    ])
    const treeProps = readonly({
      children: 'children',
      id: 'id'
    })
    const tableList = ref<IActive[]>([])
    const initData = async () => {
      const { data } = await permission({
        groupId: props.row.id,
        platformId: ''
      })
      await deepTree(data)
      tableList.value = data
      console.log('%c 🍏 tableList.value: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', tableList.value)
    }
    initData()
    const deepTree = (list: IActive[]) => {
      list.forEach(el => {
        const bool = el.actionList.every(item => {
          if (item.checkFlag === false) {
            return false
          } else {
            return true
          }
        })
        el.checkAllFlag = bool
        if (el.children && el.children.length > 0) {
          deepTree(el.children)
        }
      })
    }

    const handleSelect = (val: any) => {
      console.log(val)
    }

    const handleParentCheckbox = (val: boolean, row: IActive) => {
      row.actionList.forEach((item: any) => {
        item.checkFlag = val
      })
      httpPostSave(row)
    }

    const handleChildCheckbox = (val: boolean, row: IActive) => {
      const bool = row.actionList.every((item: any) => {
        if (item.checkFlag === false) {
          return false
        }
        return true
      })
      row.checkAllFlag = bool
      httpPostSave(row)
    }

    const httpPostSave = async (row: IActive) => {
      const target = {
        groupId: props.row.id,
        modulePermissionList: [{
          platformId: row.platformId,
          moduleId: row.id,
          actionIds: row.actionList.filter(el => el.checkFlag).map(el => el.actionId)
        }]
      }
      const { data } = await actionSaveUpdate({ ...target })
      console.log('%c 🥥 data: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', data)
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
          checkAllFlag: (row: IActive) => (
            <el-checkbox vModel={row.checkAllFlag} onChange={(val: boolean) => handleParentCheckbox(val, row)} />
          ),
          actionList: (row: IActive) => (<div class="div-assign-checkbox">
            {
              row.actionList.map((el: any) => {
                return <div key={el.id}>
                  <el-checkbox vModel={el.checkFlag} onChange={(val: boolean) => handleChildCheckbox(val, row)} label={`${el.actionName}(${el.description})`}></el-checkbox>
                </div>
              })
            }
          </div>)
        }
        }
      </tableComp >
    )
  }
})
// const checkBoxFunc = (list: any[]) => {
//   const bool = ref<boolean>(false)
//   bool.value = list.every(el => {
//     if (el.checkFlag === false) {
//       return false
//     }
//     return true
//   })
//   const changeCheckbox = (val: boolean) => {
//     bool.value = val
//   }
//   return <el-checkbox onChange={(val: boolean) => changeCheckbox(val)} vModel={bool.value}></el-checkbox>
// }
