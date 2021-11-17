<script lang="tsx">
import { defineComponent } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
const propsType = {
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSizes: {
    type: Array,
    default: () => ([10, 20, 30, 40])
  }
} as const
export default defineComponent({
  name: 'PaginationComp',
  emits: ['handlePaginationChange'],
  props: propsType,
  setup (props, { emit }) {
    const handleSizeOrCurrenChange = (val: number, type: string) => {
      emit('handlePaginationChange', val, type)
    }
    const locale = zhCn
    return () => (
      <el-config-provider locale={locale}>
        <el-pagination
          background
          vModel={[props.currentPage, 'currentPage']}
          page-sizes={props.pageSizes}
          page-size={props.pageSize}
          layout="total, sizes, prev, pager, next, jumper"
          total={props.total}
          onSizeChange={(val: number) => handleSizeOrCurrenChange(val, 'size')}
          onCurrentChange={(val: number) => handleSizeOrCurrenChange(val, 'current')}
        >
        </el-pagination>
      </el-config-provider>
    )
  }
})
</script>
