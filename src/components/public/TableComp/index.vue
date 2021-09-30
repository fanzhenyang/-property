<script lang="tsx">
import { defineComponent, Slot, watch } from 'vue'
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
    watch(() => props.data, newVal => {
      // props.data = newVal
      console.log('%c 🌯 newVal: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', newVal)
    }, { deep: true })
    return () => (
      <el-table
        data={props.data}
        treeProps={ props.treeProps}
        loading={props.loading}
        height={props.height}
        style={{ width: props.width }}
        rowKey={props.rowKey}
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
                align={column.align}
                label={column.label}
                prop={column.prop || ''}
                width={column.width}
                show-overflow-tooltip={column.tooltip || false}
              >
                {/* 具名插槽cont */}
                {slots[column.prop] && (slots[column.prop] as Slot)(column)}
              </el-table-column>
            } else {
              return <el-table-column
                align={column.align}
                key={column.label}
                label={column.label}
                prop={column.label || ''}
                width={column.width}
                show-overflow-tooltip={column.tooltip}

              />
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
