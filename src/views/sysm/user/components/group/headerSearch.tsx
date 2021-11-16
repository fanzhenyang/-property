import { defineComponent, ref, reactive } from 'vue'
import { ElForm } from 'element-plus'
import './style/headerSearch.scss'
interface IForm {
  groupName: string
  enable: boolean
  disable: boolean
  status: number | null
}
export default defineComponent({
  emits: ['headerSubmitFrom'],
  setup(props, { emit }) {
    const formRef = ref<InstanceType<typeof ElForm> | null>(null)
    const form = reactive<IForm>({
      groupName: '',
      enable: false,
      disable: false,
      status: null
    })
    const handleChange = (val: boolean, type: number) => {
      if (type === 1) {
        if (val) {
          form.enable = true
          form.disable = false
          form.status = 1
          return true
        }
        form.enable = false
        form.status = null
      } else if (type === 2) {
        if (val) {
          form.enable = false
          form.disable = true
          form.status = 0
          return true
        }
        form.disable = false
        form.status = null
      }
    }
    const submitForm = () => {
      const target = Object.assign({}, { groupName: form.groupName, status: form.status })
      emit('headerSubmitFrom', Object.freeze(target))
    }
    const resetForm = () => {
      formRef.value && formRef.value.resetFields()
    }
    return () => (
      <el-form model={form} class="form-public-fff" ref={formRef} inline labelWidth={'100px'}>
        <el-row>
          <el-col span={5}>
            <el-form-item label="用户组名称">
              <el-input vModel={form.groupName} size="mini" placeholder="请输入模块名称" />
            </el-form-item>
          </el-col>
          <el-col span={5}>
            <el-form-item label="是否启用">
              <div class="align-enable">
                <el-checkbox
                  vModel={form.enable}
                  onChange={(val: boolean) => handleChange(val, 1)}
                  size="mini"
                >启用</el-checkbox>
                <el-checkbox
                  vModel={form.disable}
                  onChange={(val: boolean) => handleChange(val, 2)}
                  size="mini"
                >停用</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col span={4}>
            <el-button type="primary" size="mini" onClick={submitForm}>查询</el-button>
            <el-button type="warning" size="mini" onClick={resetForm}>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
