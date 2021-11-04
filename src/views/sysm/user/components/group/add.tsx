import { defineComponent, ref, readonly, reactive, PropType } from 'vue'
import { ElMessage, ElForm, ElTree } from 'element-plus'
import { IDictionaryData, IGropListData } from '@/interface/sysm'
import { treeListWithPlatform } from '@/api/sysm/sysm'
import { saveOrUpdate, group } from '@/api/sysm/group'
type ElFormCtx = InstanceType<typeof ElForm>
interface IForm {
  groupName: string
  groupType: number | null
  memo: string
  status: number | null
  orderNo: number | null
  adminFlag: number | null
  moduleList: { moduleId: number, platformId: number }[]
  id: unknown
  [x: string]: any
}

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'add'
    },
    dictionaryList: {
      type: Array as PropType<IDictionaryData[]>,
      default: () => []
    },
    row: {
      type: Object as PropType<IGropListData>,
      default: () => ({})
    }
  },
  emits: ['successFunc', 'handleCancel'],
  setup(props, { emit }) {
    const ruleForm = ref<ElFormCtx | null>(null)
    const tree = ref<InstanceType<typeof ElTree> | null>(null)
    const form = reactive<IForm>({
      groupName: '',
      groupType: null,
      moduleId: null,
      moduleList: [],
      status: 0,
      orderNo: null,
      memo: '',
      adminFlag: null,
      id: null
    })
    const treeList = ref([])
    const defaultProps = readonly({
      children: 'children',
      label: 'label'
    })
    const subLoading = ref<boolean>(false)

    const initTree = async () => {
      const { data } = await treeListWithPlatform(null)
      data.forEach((el: any) => {
        el.disabled = true
      })
      treeList.value = data
    }
    initTree()

    const initEditOrDel = async () => {
      const { data } = await group(props.row.id)
      Object.keys(form).forEach(key => {
        form[key] = data[key]
      })
      console.log('%c 🥠 data: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', data)
    }

    // 编辑
    if (props.type !== 'add') {
      initEditOrDel()
    }

    const handleCancel = () => {
      emit('handleCancel')
    }

    const subForm = async () => {
      subLoading.value = true
      await saveOrUpdate({ ...form }, () => {
        subLoading.value = false
      })
    }

    const handleCheckChange = () => {
      if (!tree.value) {
        return false
      }
      const res = tree.value.getCheckedNodes(false, false)
      form.moduleList = res.map((el: any) => ({ moduleId: el.id, platformId: el.obj.platformId }))
    }

    return () => (
      <el-form mode={form} ref={ruleForm} class="form-public-grey" labelWidth={'90px'}>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="用户组名称" prop='groupName'>
              <el-input vModel={form.groupName} size="mini" readonly={props.type === 'details'} placeholder="请输入用户组名称" />
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="用户组分类" prop='platformId'>
              <el-select style={{ width: '100%' }} vModel={form.groupType} disabled={props.type === 'details'} clearable size="mini" filterable placeholder="请选择">
                {
                  props.dictionaryList.map((option: IDictionaryData) => {
                    return <el-option label={option.dicName} value={option.id} key={option.id} />
                  })
                }
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="排序号" prop={'orderNo'}>
              <el-input vModel={form.orderNo} size="mini" readonly={props.type === 'details'} placeholder="排序号" />
            </el-form-item>
          </el-col>
          <el-col span={6}>
            <el-form-item label="是否启用">
              <el-switch vModel={form.status} disabled={props.type === 'details'} activeValue={1} size="mini" inactiveValue={0} />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="是否管理员">
              <el-switch vModel={form.adminFlag} disabled={props.type === 'details'} activeValue={1} size="mini" inactiveValue={0} />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={24}>
            <el-form-item label="模块名称" prop='moduleId'>
              <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar__view scrollbar-view-height" style={{ height: '20vh' }}>
                <el-tree
                  ref={tree}
                  data={treeList.value}
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  highlight-current
                  default-checked-keys={form.moduleList}
                  props={defaultProps}
                  onCheckChange={() => handleCheckChange()}
                />
              </el-scrollbar>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter={20}>
          <el-col span={24}>
            <el-form-item label="描述">
              <el-input resize={'none'} type="textarea" readonly={props.type === 'details'} vModel={form.memo} size="mini" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span={24} style={{ 'text-align': 'right' }}>
            {
              props.type === 'details' ? null : <el-button type="primary" plain size="mini" loading={subLoading.value} onClick={() => subForm()}>保存</el-button>
            }
            <el-button plain size="mini" onClick={() => handleCancel()}>关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
