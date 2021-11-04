<script lang="tsx">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  emits: ['handleOperate'],
  setup (props, { emit, slots }) {
    const searchShow = ref<boolean>(false)
    const handleOperate = (type: string) => {
      if (type === 'search') {
        searchShow.value = !searchShow.value
      } else {
        emit('handleOperate', type)
      }
    }
    return () => <>
      <el-button type="primary" plain size="mini" icon="el-icon-plus" onClick={() => handleOperate('add')}>新增</el-button>
      <el-button type="danger" plain size="mini" icon="el-icon-delete" onClick={() => handleOperate('delete')}>删除</el-button>
      <el-button type="success" plain size="mini" icon="el-icon-bottom" onClick={() => handleOperate('export')}>导出</el-button>
      <el-button type="primary" plain size="mini" icon="el-icon-search" onClick={() => handleOperate('search')}>查询</el-button>
      <el-collapse-transition>
        {
          searchShow.value ? <div>
            {slots.collapse && slots.collapse()}
          </div> : null
        }
      </el-collapse-transition>
    </>
  }
})
</script>
