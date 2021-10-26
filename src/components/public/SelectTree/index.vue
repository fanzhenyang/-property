<script lang="tsx">
import { defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
const propsType = {
  width: {
    type: String,
    default: '20rem'
  },
  defaultProps: {
    type: Object,
    require: true
  },
  size: {
    type: String,
    default: 'mini'
  },
  treeLsit: {
    type: Array,
    require: true
  },
  disType: {
    type: Boolean,
    default: false
  }
} as const
interface IDefaultProps {
  label: string
  children: string | []
  value: string | number
}
export default defineComponent({
  name: 'SelectTree',
  props: propsType,
  emits: ['nodeClick'],
  setup (props, { emit }) {
    const filterText = ref('')
    const showPopover = ref(false)
    const parentText = ref('')

    const handleNodeClick = (node: any) => {
      console.log('%c 🍌 node: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', (props.defaultProps as IDefaultProps).label)
      parentText.value = node[(props.defaultProps as IDefaultProps).label]
      showPopover.value = false
      emit('nodeClick', node[(props.defaultProps as IDefaultProps).value])
    }
    const filterNode = (value: string, data: any) => {
      if (!value) {
        data = props.treeLsit
        return true
      }
      return data[(props.defaultProps as IDefaultProps).label].indexOf(value) !== -1
    }

    const handleFocus = () => {
      showPopover.value = true
    }
    const handleClickDom = () => {
      showPopover.value = false
      filterText.value = ''
    }
    window.addEventListener('click', handleClickDom)

    const tree = ref<HTMLDivElement | null>(null)
    watch(() => filterText.value, newText => {
      (tree.value as any).filter(newText)
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClickDom)
    })

    const { inputRef, width } = useInputWidth()

    return () => (
      <>
        <el-popover
          placement="bottom"
          width={width.value}
          v-model={[showPopover.value, 'visible']}
        >
          {{
            default: () => (
              <>
                <el-input disabled={props.disType} vModel={filterText.value} size="mini" placeholder="请进行搜索过滤" />
                <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar__view scrollbar-view-height" style={{ height: '20vh' }}>
                  <el-tree ref={tree} data={props.treeLsit} props={props.defaultProps} onNodeClick={handleNodeClick}
                    defaultExpandAll filterNodeMethod={filterNode} style={{ height: '20vh' }} nodeKey={props.defaultProps?.value}/>
                </el-scrollbar>
              </>
            ),
            reference: () => (
              <el-input disabled={props.disType} vModel={parentText.value} ref={inputRef} size={props.size} readonly placeholder="请选择" onFocus={handleFocus}>
                {{
                  suffix: () => <i class={showPopover.value ? 'el-icon-arrow-down transition rotate' : 'el-icon-arrow-down transition'}></i>
                }}
              </el-input>
            )
          }}
        </el-popover>
      </>
    )
  }
})
const useInputWidth = () => {
  const inputRef = ref<HTMLDivElement | null>(null)
  const width = ref('')
  const initWidth = () => {
    width.value = `${(inputRef.value as any).input.clientWidth}px`
  }
  onMounted(() => {
    nextTick(() => {
      initWidth()
    })
  })
  return { inputRef, width }
}
</script>

<style lang="scss" scoped>
.transition {
  transition: .2s all;
}
.rotate {
  transform: rotate(-180deg);
}
</style>
