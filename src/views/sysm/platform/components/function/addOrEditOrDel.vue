<script lang="tsx">
import { defineComponent, ref, Ref, inject, readonly, reactive, PropType, onMounted } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { saveOrUpdate } from '@/api/sysm/function'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
interface Ioption {
  id: string | number
  dicName: string
  dicValue: string
}
interface listData {
  platformList: IPlatform[]
  parentTree: IPlatformTree[]
}
interface IForm {
  actionName: string
  platformId: number | null
  moduleId: number | null
  status: number | null
  orderNo: number | null
  description: string
  id: unknown
  [x: string]: any
}

type ElFormCtx = InstanceType<typeof ElForm>
export default defineComponent({
  props: {
    actionNameList: {
      type: Array as PropType<Ioption[]>,
      default: () => ([])
    },
    row: {
      type: Object as PropType<Ref<any>>,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  emits: ['successFunc', 'handleCancel'],
  setup (props, { emit }) {
    const form = reactive<IForm>({
      actionName: '',
      platformId: null,
      moduleId: null,
      status: 0,
      orderNo: null,
      description: '',
      moduleName: '',
      id: null
    })

    // 获取到表格数据
    const tableList = inject<listData>('listData')
    const defaultTreeProps = readonly({
      children: 'children',
      label: 'moduleName',
      value: 'id'
    })
    const ruleForm = ref<ElFormCtx | null>(null)
    const subLoading = ref<boolean>(false)

    if (props.type === 'edit' && props.row.value) {
      // console.log('%c 🧀 props.row.value: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', props.row.value)
      Object.keys(form).forEach(key => {
        if (key === 'moduleId') {
          form.moduleId = props.row.value.id
        } else if (key === 'id') {
          form.id = props.row.value.actionId
        } else {
          form[key] = props.row.value[key]
        }
      })
      // console.log('%c 🍠 props.row.value: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', props.row.value)
    }

    const rules = ref<any>({
      actionName: [{ validator: (rule: any, value: string | number, callback: () => boolean) => handleRules(1, rule, value, callback), trigger: 'change' }],
      platformId: [{ validator: (rule: any, value: string | number, callback: () => boolean) => handleRules(2, rule, value, callback), trigger: 'change' }],
      moduleId: [{ validator: (rule: any, value: string | number, callback: () => boolean) => handleRules(3, rule, value, callback), trigger: 'blur' }],
      orderNo: [{ validator: (rule: any, value: string | number, callback: () => boolean) => handleRules(4, rule, value, callback), trigger: 'blur' }]
    })

    const handleRules = (type: number, rule: { field: string|number }, value: unknown, callback: (e?: Error) => boolean) => {
      if (!form[rule.field]) {
        if (type === 1) {
          return callback(new Error('请选择功能名称'))
        } else if (type === 2) {
          return callback(new Error('请选择所属平台'))
        } else if (type === 3) {
          return callback(new Error('请选择所属模块'))
        } else {
          return callback(new Error('请填写排序号'))
        }
      } else if (ruleForm.value) {
        if (type === 1) {
          form.actionName && ruleForm.value.validateField('actionName', () => { '错误' })
        } else if (type === 2) {
          form.platformId && ruleForm.value.validateField('platformId', () => { '错误' })
        } else if (type === 3) {
          form.moduleId && ruleForm.value.validateField('moduleId', () => { '错误' })
        } else {
          form.orderNo && ruleForm.value.validateField('orderNo', () => { '错误' })
        }
      }
    }

    const nodeClick = (value: number) => {
      form.moduleId = value
      console.log('%c 🍢 form.moduleId: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', form.moduleId)
    }

    const parentList = () => {
      return (<selectTree textEcho={form.moduleName} treeLsit={form.platformId ? tableList?.parentTree : []} defaultProps={defaultTreeProps} {...{ onNodeClick: (value: number) => nodeClick(value) }} />)
    }
    const subForm = async () => {
      console.log('%c 🥠 ruleForm.value: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', ruleForm.value)
      if (!ruleForm.value) return
      ruleForm.value.validate((valid: any) => {
        console.log('%c 🍹 valid: ', 'font-size:20px;background-color: #42b983;color:#fff;', valid)
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // subLoading.value = true
      // // console.log('%c 🥑 form: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', form)
      // await saveOrUpdate(Object.assign(form, { orderNo: Number(form.orderNo) }), () => {
      //   subLoading.value = false
      // }, props.type)
      // emit('successFunc')
    }

    const handleCancel = () => {
      emit('handleCancel')
    }

    return () => (
      <el-form mode={form} ref={ruleForm} rules={rules} class="form-public-grey" labelWidth={'80px'}>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="功能名称" prop='actionName'>
              <el-select style={{ width: '100%' }} size="mini" vModel={form.actionName} placeholder="请选择">
                {
                  props.actionNameList.map((el: Ioption) => <el-option key={el.id} label={el.dicName} value={el.dicValue} />)
                }
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="所属平台" prop='platformId'>
              <el-select style={{ width: '100%' }} vModel={form.platformId} clearable size="mini" filterable placeholder="请选择">
                {
                  tableList && tableList.platformList.map(option => {
                    return <el-option label={option.platformName} value={option.id} />
                  })
                }
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="所属模块" prop='moduleId'>
              {parentList()}
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="排序号" prop={'orderNo'}>
              <el-input vModel={form.orderNo} size="mini" placeholder="排序号" />
            </el-form-item>

          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="是否启用">
              <el-switch vModel={form.status} activeValue={1} size="mini" inactiveValue={0} />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={24}>
            <el-form-item label="备注">
              <el-input resize={'none'} type="textarea" vModel={form.description} size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span={24} style={{ 'text-align': 'right' }}>
            <el-button type="primary" plain size="mini" loading={subLoading.value} onClick={() => subForm()}>保存</el-button>
            <el-button plain size="mini" onClick={handleCancel}>关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
</script>
