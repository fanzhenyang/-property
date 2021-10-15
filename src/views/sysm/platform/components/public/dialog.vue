<script lang="tsx">
import { defineComponent, ref, toRef, toRefs } from 'vue'
import { openDailog } from '@/hooks/dialog'
const propsType = {
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '15vw'
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: false
  }
} as const
export default defineComponent({
  props: propsType,
  setup (props, { slots, emit }) {
    const { dialogVisible } = toRefs(props)
    const visible = ref<boolean>(dialogVisible.value)
    const onClose = () => {
      emit('update:dialogVisible', false)
    }
    return () => (
      <el-dialog
        destroy-on-close
        top={props.top}
        title={props.title}
        vModel={visible.value}
        width={props.width}
        close-on-click-modal={props.modal}
        append-to-body={true}
        onClose={onClose}
      >
        {{
          default: () => <div>{slots.main && slots.main() }</div>,
          footer: () => <div>{slots.footer && slots.footer()}</div>
        }}
      </el-dialog>
    )
  }
})
</script>
