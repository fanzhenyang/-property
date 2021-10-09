<script lang="tsx">
import { defineComponent, Slot, ref } from 'vue'
// 定义类型
const PropsType = {
  rowKey: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    require: true
  },
  height: {
    type: String,
    default: '60vh'
  },
  loading: {
    type: Boolean,
    default: false
  },
  columnData: {
    type: Array,
    default: () => ([])
  },
  data: {
    type: Array,
    default: () => ([])
  },
  treeProps: {
    type: Object,
    default: () => ({})
  },
  isSelection: {
    type: Boolean,
    default: false
  },
  isIndex: {
    type: Boolean,
    default: false
  },
  defaultExpandpandAll: {
    type: Boolean,
    default: false
  },
  tableRef: {
    type: Object,
    default: () => ({})
  }
} as const

export interface IColumn {
  template?: boolean
  templateHeader?: boolean
  align?: string
  label: string
  prop: string
  width?: string
  tooltip?: boolean
  ispass?: boolean // 是否显示
}

export default defineComponent({
  name: 'TableComp',
  inheritAttrs: false,
  props: PropsType,
  setup (props, { slots, emit }) {
    const selectList = ref<any[]>([])
    const headerSlot = (column: IColumn) => {
      return column.templateHeader ? <>{slots[`${column.prop}Header`] && (slots[`${column.prop}Header`] as Slot)()}</> : null
    }
    const defaultSlot = (column:IColumn) => {
      return (scope: any) => (<>{ slots[column.prop] && (slots[column.prop] as Slot)(scope.row, scope.$index)}</>)
    }

    // 单个选择
    const handleSelectChange = (val: any[], row: any) => {
      emit('handleSelect', 'slef', val)
    }

    // 全选,全部取消
    const handleSelectAllChange = (val: any[]) => {
      deepList(val, val.length > 0)
      console.log('%c 🍩 val: ', 'font-size:20px;background-color: #F5CE50;color:#fff;', val)
      emit('handleSelect', 'all', val)
    }
    const deepList = (list: any[], bool: boolean) => {
      console.log('%c 🍰 bool: ', 'font-size:20px;background-color: #42b983;color:#fff;', bool)
      list.forEach((item: any) => {
        if (item[props.treeProps.children] && item[props.treeProps.children].length > 0) {
          selectList.value.push(item)
          deepList(item[props.treeProps.children], bool)
          props.tableRef.value.toggleRowSelection(item, bool)
        } else {
          selectList.value.push(item)
          props.tableRef.value.toggleRowSelection(item, bool)
        }
      })
    }

    return () => (
      <el-table
        data={props.data}
        ref={props.tableRef}
        treeProps={props.treeProps}
        loading={props.loading}
        height={props.height}
        style={{ width: props.width }}
        rowKey={props.rowKey}
        class="table-public"
        onSelect={handleSelectChange}
        onSelectAll={handleSelectAllChange}
        default-expand-all={props.defaultExpandpandAll}
      >
        {
          TableColumn(props.isSelection, props.isIndex)
        }

        {
          (props.columnData as IColumn[]).map((column: IColumn) => {
            if (column.ispass || !Object.prototype.hasOwnProperty.call(column, 'ispass')) {
              if (column.template) {
                return <el-table-column
                  key={column.label}
                  align={column.align || 'center'}
                  label={column.templateHeader ? null : column.label}
                  prop={column.prop || ''}
                  width={column.width}
                  show-overflow-tooltip={column.tooltip || false}
                  vSlots={{ header: headerSlot(column), default: defaultSlot(column) }}
                />
              } else {
                return <el-table-column
                  align={column.align || 'center'}
                  key={column.label}
                  label={column.templateHeader ? null : column.label}
                  prop={column.prop || ''}
                  width={column.width}
                  show-overflow-tooltip={column.tooltip}
                  vSlots={{ header: headerSlot(column) }}
                />
              }
            }
          })
        }
      </el-table>
    )
  }
})

const TableColumn = (isSelection = false, isIndex = false) => {
  if (isSelection) {
    return <el-table-column type="selection" align="center" reserve-selection={true} width="50" />
  }

  if (isIndex) {
    return <el-table-column type="index" label="序号" align="center" width="50" />
  }
  return null
}
</script>

<style lang="scss" scoped>
.table-public {
  background: transparent;
}
</style>
