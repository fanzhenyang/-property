import { defineComponent, ref, reactive, inject, Ref } from 'vue'
import { IGropListData } from '@/interface/sysm'
import { ElForm } from 'element-plus'
import './style/headerSearch.scss'
interface IForm {
  account: string
  enable: boolean
  disable: boolean
  onJob: boolean
  stepDown: boolean
  isLock: boolean
  Unlock: boolean
  status: number | null
  groupId: number | null
  incumbentFlag: number | null
  lockFlag: number | null
}
export default defineComponent({
  emits: ['headerSubmitFrom'],
  setup(props, { emit }) {
    const formRef = ref<InstanceType<typeof ElForm> | null>(null)
    // 获取到表格数据
    const userGroupList = inject<Ref<IGropListData[]>>('UserGroupList')
    const form = reactive<IForm>({
      account: '',
      enable: false,
      disable: false,
      status: null,
      onJob: false,
      stepDown: false,
      isLock: false,
      Unlock: false,
      lockFlag: null,
      incumbentFlag: null,
      groupId: null
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
      } else if (type === 3) {
        if (val) {
          form.onJob = true
          form.stepDown = false
          form.incumbentFlag = 1
          return true
        }
        form.onJob = false
        form.incumbentFlag = null
      } else if (type === 4) {
        if (val) {
          form.onJob = false
          form.stepDown = true
          form.incumbentFlag = 0
          return true
        }
        form.stepDown = false
        form.incumbentFlag = null
      } else if (type === 5) {
        if (val) {
          form.isLock = true
          form.Unlock = false
          form.lockFlag = 1
          return true
        }
        form.isLock = false
        form.lockFlag = null
      } else if (type === 6) {
        if (val) {
          form.isLock = false
          form.Unlock = true
          form.lockFlag = 0
          return true
        }
        form.Unlock = false
        form.lockFlag = null
      }
    }
    const submitForm = () => {
      const target = Object.assign({}, { account: form.account, status: form.status, groupId: form.groupId, lockFlag: form.lockFlag, incumbentFlag: form.incumbentFlag })
      console.log('%c 🌮 target: ', 'font-size:20px;background-color: #33A5FF;color:#fff;', target)
      emit('headerSubmitFrom', Object.freeze(target))
    }
    const resetForm = () => {
      form.account = ''
      form.enable = false
      form.disable = false
      form.status = null
      form.onJob = false
      form.stepDown = false
      form.isLock = false
      form.Unlock = false
      form.lockFlag = null
      form.incumbentFlag = null
      form.groupId = null
      submitForm()
    }
    return () => (
      <el-form model={form} class="form-public-fff" ref={formRef} inline labelWidth={'100px'}>
        <el-row>
          <el-col span={4}>
            <el-form-item label="用户账号">
              <el-input vModel={form.account} size="mini" placeholder="请输入用户账号" />
            </el-form-item>
          </el-col>
          <el-col span={4}>
            <el-form-item label="所属用户组">
              <el-select clearable size="mini" vModel={form.groupId} placeholder="Select">
                {
                  userGroupList?.value.map(el => {
                    return <el-option key={el.id} label={el.groupName} value={el.id} />
                  })
                }
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={4}>
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
            <el-form-item label="是否在职">
              <div class="align-enable">
                <el-checkbox
                  vModel={form.onJob}
                  onChange={(val: boolean) => handleChange(val, 3)}
                  size="mini"
                >在职</el-checkbox>
                <el-checkbox
                  vModel={form.stepDown}
                  onChange={(val: boolean) => handleChange(val, 4)}
                  size="mini"
                >离职</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col span={4}>
            <el-form-item label="是否锁定">
              <div class="align-enable">
                <el-checkbox
                  vModel={form.isLock}
                  onChange={(val: boolean) => handleChange(val, 5)}
                  size="mini"
                >锁定</el-checkbox>
                <el-checkbox
                  vModel={form.Unlock}
                  onChange={(val: boolean) => handleChange(val, 6)}
                  size="mini"
                >未锁</el-checkbox>
              </div>
            </el-form-item>
          </el-col>
          <el-col span={4}>
            <el-button type="primary" size="mini" onClick={submitForm}>查询</el-button>
            <el-button type="warning" size="mini" onClick={() => resetForm()}>重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
