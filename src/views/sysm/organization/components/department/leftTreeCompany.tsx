import { defineComponent, ref, readonly } from 'vue'
import { listByTree } from '@/api/sysm/department'
import './style/leftTreeCompany.scss'
import { ElMenuItem } from 'element-plus'
export default defineComponent({
  emits: ['handleTreeNodeClick'],
  setup(props, { emit }) {
    const loading = ref<boolean>(false)
    const treeData = ref<any[]>([])
    const defaultProps = readonly({
      children: 'children',
      label: 'companyName'
    })
    const initTree = async () => {
      loading.value = true
      const { data } = await listByTree(null, () => {
        loading.value = false
      })
      treeData.value = [{
        id: null,
        companyName: '全部公司',
        children: data
      }]
    }
    initTree()
    const handleNodeClick = (data: any) => {
      emit('handleTreeNodeClick', data)
    }
    return () => (
      <el-tree
        data={treeData.value}
        props={defaultProps}
        accordion
        node-key="id"
        highlight-current
        default-expand-all
        class="tree-company"
        onNodeClick={handleNodeClick}
      />
    )
  }
})
