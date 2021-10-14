<script lang="tsx">
import { defineComponent, ref, readonly, watch, reactive } from 'vue'
import { list } from '@/api/act/act'
import { IPlatform, IPlatformTree } from '@/interface/sysm'
import { TreeList } from '@/interface/act'
const propsType = {
  listGather: {
    type: Object,
    default: () => ({})
  }
} as const

export default defineComponent({
  props: propsType,
  setup (props, { emit }) {
    const form = reactive({
      moduleName: '',
      modulePath: '',
      platformId: null,
      status: 0,
      url: '',
      logo: '',
      memo: '',
      orderNo: 0,
      pId: 0,
      actModelTypeId: 0,
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
    watch(() => [props.listGather.platformList, props.listGather.parentTree], ([newFormList, newParentList]) => {
      newFormList && platformList(newFormList)
      newParentList && parentList(newParentList)
    }, { deep: true })

    const platformList = (list: IPlatform[]) => {
      return (<>
        {
          list && list.map(option => {
            return <el-option label={option.platformName} value={option.id} />
          })
        }
      </>)
    }
    const nodeClick = (value: number, type: number) => {
      console.log('%c 🥑 type: ', 'font-size:20px;background-color: #EA7E5C;color:#fff;', type)
      console.log('%c 🍰 value: ', 'font-size:20px;background-color: #FCA650;color:#fff;', value)
      // if (typeof value === 'string') {
      //   (form.pId as string) = value
      // }
      // if (typeof value === 'number') {
      //   (form.pId as number) = value
      // }
      // if (t) {}
      type === 1 ? form.pId = value : form.actModelTypeId = value
    }
    const parentList = (list: IPlatformTree[] | TreeList[], type = 1) => {
      return (<selectTree treeLsit={form.platformId && type === 1 ? list : type === 2 ? list : []} defaultProps={type === 1 ? defaultTreeProps : defaultTreeProps1} {...{ onNodeClick: (value: number) => nodeClick(value, type) }} />)
    }
    return () => (
      <el-form mode={form} class="form-public-grey" labelWidth={'80px'}>
        <el-row gutter={20}>
          <el-col span={6}>
            <el-form-item label="模块名称">
              <el-input vModel={form.moduleName} size="mini" placeholder="请输入模块名称" />
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
              <el-input vModel={form.moduleName} size="mini" placeholder="请输入菜单路径" />
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
              <el-select vModel={form.platformId} clearable size="mini" filterable placeholder="请选择">
                {platformList(props.listGather.platformList)}
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
              <el-input vModel={form.logo} size="mini" placeholder="排序号" readonly>
                {{
                  suffix: () => <el-button size="mini" type="text">图片上传</el-button>
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
          <el-button type="primary" plain size="mini">保存</el-button>
          <el-button plain size="mini" >关闭</el-button>
        </el-row>
      </el-form>
    )
  }
})
</script>
