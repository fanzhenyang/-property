<script lang="tsx">
import { defineComponent, nextTick, onMounted, toRefs, onUnmounted, ref, watch } from 'vue'
import { ElInput } from 'element-plus'
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
  },
  textEcho: {
    type: String,
    default: ''
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
    const filterText = ref<string>('')
    const showPopover = ref<boolean>(false)
    const parentText = ref<string>('')

    const handleNodeClick = (node: any) => {
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

    if (props.textEcho) {
      const { textEcho } = toRefs(props)
      parentText.value = textEcho.value
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
    const handleShowPopover = () => {
      console.log('%c 🥖  props.treeLsit: ', 'font-size:20px;background-color: #B03734;color:#fff;', props.treeLsit)
      showPopover.value = true
    }
    const handleHidePopover = () => {
      showPopover.value = false
    }
    return () => (
      <el-popover
        placement="bottom"
        width={width.value}
        v-model={[showPopover.value, 'visible']}
        trigger="click"
        onShow={() => handleShowPopover()}
        onHide={() => handleHidePopover()}
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
            <el-input disabled={props.disType} vModel={parentText.value} ref={inputRef} size={props.size} readonly placeholder="请选择" >
              {{
                suffix: () => <i class={showPopover.value ? 'el-icon-arrow-down transition rotate' : 'el-icon-arrow-down transition'}></i>
              }}
            </el-input>
          )
        }}
      </el-popover>
    )
  }
})
const useInputWidth = () => {
  const inputRef = ref<InstanceType<typeof ElInput> | null>(null)
  const width = ref<string>('')
  const initWidth = () => {
    if (inputRef.value) {
      width.value = `${inputRef.value.$el.clientWidth}px`
    }
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
