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
export default defineComponent({
  props: propsType,
  emits: ['submitSearchForm', 'resetSearchForm'],
  setup (props, { emit }) {
    const defaultTreeProps = readonly({
      children: 'children',
      label: 'moduleName',
      value: 'id'
    })
    const form = reactive({
      moduleName: '',
      status: null,
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
      console.log('%c 🍨 formRef.value: ', 'font-size:20px;background-color: #B03734;color:#fff;', formRef.value)
      if (!formRef.value) return false
      form.moduleName = ''
      form.status = null
      form.pId = 0
      formRef.value.resetFields()
      emit('resetSearchForm', form)
    }

    const submitForm = () => {
      emit('submitSearchForm', form)
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
              <el-switch vModel={form.status} activeValue={1} size="mini" inactiveValue={0} />
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
