<script lang="tsx">
import { defineComponent, ref, readonly, watch, reactive } from 'vue'
import { list } from '@/api/act/act'
import { upload, saveOrUpdate } from '@/api/sysm/sysm'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import { TreeList } from '@/interface/act'
import { ElMessage } from 'element-plus'
const propsType = {
  listGather: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'add'
  },
  rows: {
    type: Object,
    default: () => ({})
  }
} as const
interface IForm<T, U> {
  moduleName: T
  modulePath: T
  platformId: T | U
  status: number
  url: T
  logo: T
  memo: T
  orderNo: T | U
  pId: T | U
  actModelTypeId: T | U
  actModelId: T | U
  fileName: T
  [x: string]: any
}
export default defineComponent({
  props: propsType,
  emits: ['successFunc', 'handleCancel'],
  setup (props, { emit }) {
    const form = reactive<IForm<string, number>>({
      moduleName: '',
      modulePath: '',
      platformId: '',
      status: 0,
      url: '',
      logo: '',
      memo: '',
      orderNo: '',
      pId: '',
      actModelTypeId: '',
      actModelId: '',
      fileName: ''
    })
    // label
    const defaultTreeProps = readonly({
      children: 'children',
      label: 'moduleName',
      value: 'id'
    })
    const defaultTreeProps1 = readonly({
      children: 'children',
      label: 'label',
      value: 'id'
    })
    watch(() => [props.listGather.platformList, props.listGather.parentTree, props.rows], ([newFormList, newParentList, newRows]) => {
      newFormList && platformList(newFormList)
      newParentList && parentList(newParentList)
      newRows && formDataRow(newRows)
    }, { deep: true })

    const platformList = (list: IPlatform[]) => {
      return (<>
        {
          list && list.map(option => {
            return <el-option label={option.platformName || option.name} value={option.id} />
          })
        }
      </>)
    }
    const formDataRow = (row: IPlatform) => {
      Object.keys(row).forEach(key => {
        form[key] = row[key]
      })
      console.log('%c 🥜 row[key]: ', 'font-size:20px;background-color: #E41A6A;color:#fff;', form)
    }
    const nodeClick = (value: number, type: number) => {
      if (type === 1) {
        form.pId = value
      } else {
        form.actModelTypeId = value
        getList()
      }
    }
    const technological = ref<any[]>([])
    const getList = async () => {
      const { data } = await list({ category: form.actModelTypeId, status: 1 })
      technological.value = data
    }
    const parentList = (list: IPlatformTree[] | TreeList[], type = 1) => {
      return (<selectTree treeLsit={form.platformId && type === 1 ? list : type === 2 ? list : []} defaultProps={type === 1 ? defaultTreeProps : defaultTreeProps1} {...{ onNodeClick: (value: number) => nodeClick(value, type) }} />)
    }

    const beforeAvatarUpload = async (file: any) => {
      const param = new FormData()
      param.append('file', file)
      const { data } = await upload(param)
      form.fileName = file.name
      form.logo = data
      return false
    }

    const subLoading = ref<boolean>(false)
    const subForm = async () => {
      if (form.modulePath === '' || form.moduleName === '' || form.url === '') {
        ElMessage.warning('请分别填写模块名称、文件路径、菜单路径')
        return false
      }
      if (form.orderNo && isNaN(Number(form.orderNo))) {
        form.orderNo = ''
        ElMessage.warning('请输入数字')
        return false
      }
      subLoading.value = true
      await saveOrUpdate(Object.assign(form, { orderNo: Number(form.orderNo) }), () => {
        subLoading.value = false
      })
      emit('successFunc')
    }
    const handleCancel = () => {
      emit('handleCancel')
    }
    return () => (
      <el-form mode={form} class="form-public-grey" labelWidth={'80px'}>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="模块名称">
              <el-input v-model={form.moduleName} size="mini" placeholder="请输入模块名称" />
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="所属平台">
              <el-select style={{ width: '100%' }} vModel={form.platformId} clearable size="mini" filterable placeholder="请选择">
                {platformList(props.listGather.platformList)}
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="上级模块">
              {parentList(props.listGather.parentTree, 1)}
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="是否启用">
              <el-switch vModel={form.status} activeValue={1} size="mini" inactiveValue={0} />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="菜单路径">
              <el-input vModel={form.url} size="mini" placeholder="请输入菜单路径" />
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="文件路径">
              <el-input vModel={form.modulePath} size="mini" placeholder="请输入文件路径" />
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="流程分类">
              {parentList(props.listGather.treeList, 2)}
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="流程名称">
              <el-select vModel={form.actModelId} clearable size="mini" filterable placeholder="请选择">
                {platformList(technological.value)}
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="排序号">
              <el-input vModel={form.orderNo} size="mini" placeholder="排序号" />
            </el-form-item>
          </el-col>
          <el-col span={12}>
            <el-form-item label="模块图标">
              <el-input vModel={form.fileName} size="mini" placeholder="排序号" readonly>
                {
                //  action={'/dfs/upload'}
                }
                {{
                  suffix: () => <el-upload
                    class="avatar-uploader"
                    accept={'image/*'}
                    show-file-list={false}
                    before-upload={(file: any) => beforeAvatarUpload(file)}>
                    <el-button type="text" size="mini">图片上传</el-button>
                  </el-upload>
                }}
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={24}>
            <el-form-item label="备注">
              <el-input resize={'none'} type="textarea" vModel={form.memo} size="mini" />
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
