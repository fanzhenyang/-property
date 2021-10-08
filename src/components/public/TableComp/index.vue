<script lang="tsx">
import { defineComponent, Slot } from 'vue'
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
}

export default defineComponent({
  name: 'TableComp',
  inheritAttrs: false,
  props: PropsType,
  setup (props, { slots, attrs }) {
    const headerSlot = (column: IColumn) => {
      return column.templateHeader ? <>{slots[`${column.prop}Header`] && (slots[`${column.prop}Header`] as Slot)()}</> : null
    }
    return () => (
      <el-table
        data={props.data}
        treeProps={ props.treeProps}
        loading={props.loading}
        height={props.height}
        style={{ width: props.width }}
        rowKey={props.rowKey}
        class="table-public"
        defaultExpandpandAll={props.defaultExpandpandAll}
      >

        {
          TableColumn(props.isSelection, props.isIndex)
        }

        {
          (props.columnData as any[]).map((column: IColumn) => {
            if (column.template) {
              return <el-table-column
                key={column.label}
                align={column.align || 'center'}
                label={column.templateHeader ? null : column.label}
                prop={column.prop || ''}
                width={column.width}
                show-overflow-tooltip={column.tooltip || false}
              >
                {/* 具名插槽cont */}

                {{
                  header: headerSlot(column),
                  default: (scope: any) => (<>{ slots[column.prop] && (slots[column.prop] as Slot)(scope.row, scope.$index) }</>)
                }}
              </el-table-column>
            } else {
              return <el-table-column
                align={column.align || 'center'}
                key={column.label}
                label={column.templateHeader ? null : column.label}
                prop={column.prop || ''}
                width={column.width}
                show-overflow-tooltip={column.tooltip}
              >
                {{ header: headerSlot(column) }}
              </el-table-column>
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
