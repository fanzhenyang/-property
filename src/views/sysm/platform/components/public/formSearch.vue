<script lang="tsx">
import { defineComponent, reactive, watch, ref, readonly } from 'vue'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import { ElForm } from 'element-plus'
const propsType = {
  listGather: {
    type: Object,
    default: () => ({})
  }
} as const

interface IForm {
  moduleName: string
  status: unknown
  disable?: boolean
  enable?: boolean
  platformId: number
  pId: number
}

export default defineComponent({
  props: propsType,
  emits: ['submitSearchForm', 'resetSearchForm'],
  setup (props, { emit }) {
    const defaultTreeProps = readonly({
      children: 'children',
      label: 'moduleName',
      value: 'id'
    })
    const form = reactive<IForm>({
      moduleName: '',
      status: null,
      disable: false,
      enable: false,
      platformId: 1,
      pId: 0
    })
    watch(() => [props.listGather.platformList, props.listGather.parentTree], ([newFormList, newParentList]) => {
      newFormList && platformList(newFormList)
      newParentList && parentList(newParentList)
    }, { deep: true })
    const platformList = (list: IPlatform[]) => {
      return <>
        {
          list.map(option => {
            return <el-option label={option.platformName} value={option.id} />
          })
        }
      </>
    }

    const nodeClick = (value: number) => {
      form.pId = value
    }
    const parentList = (list: IPlatformTree[]) => {
      return (<selectTree treeLsit={list} defaultProps={defaultTreeProps} {...{ onNodeClick: nodeClick }} />)
    }

    const formRef = ref<InstanceType<typeof ElForm>>()

    const resetForm = () => {
      if (!formRef.value) return false
      form.moduleName = ''
      form.status = null
      form.pId = 0
      form.enable = false
      form.disable = false
      formRef.value.resetFields()
      emit('resetSearchForm', form)
    }

    const submitForm = () => {
      emit('submitSearchForm', form)
    }

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

    return () => (
      <el-form model={form} class="form-public-fff" ref={formRef} inline labelWidth={'80px'}>
        <el-row>
          <el-col span={5}>
            <el-form-item label="模块名称">
              <el-input vModel={form.moduleName} size="mini" placeholder="请输入模块名称" />
            </el-form-item>
          </el-col>
          <el-col span={5}>
            <el-form-item label="所属平台">
              <el-select vModel={form.platformId} clearable size="mini" filterable placeholder="请选择">
                {platformList(props.listGather.platformList)}
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={5}>
            <el-form-item label="上级模块">
              {parentList(props.listGather.parentTree)}
            </el-form-item>
          </el-col>
          <el-col span={5}>
            <el-form-item label="是否启用">
              <div class="align-item">
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
</script>

<style lang="scss" scoped>
.align-item {
  display: flex;
  align-items: center;
  height: 100%;
  /deep/.el-checkbox {
    color: #fff;
  }
}
</style>
