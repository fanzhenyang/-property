<script lang="tsx">
import { defineComponent, readonly, ref, watch, inject } from 'vue'
import { IColumn } from '@/components/public/TableComp/index.vue'
import { IActive } from '@/interface/sysm'
export default defineComponent({
  emits: ['handleOperation', 'handleTableSelect'],
  props: ['id'],
  setup (props, { emit }) {
    const columnData = readonly<IColumn[]>([
      { label: '模块名称', prop: 'moduleName', align: 'left', width: '240px ' },
      { label: '功能名称', prop: 'actionList', template: true }
    ])
    const tableRef = ref<any>(null)
    const treeProps = readonly({
      children: 'children',
      id: 'id'
    })
    // 获取到表格数据
    const tableList = inject<any>('listData')

    // 点击表格操作按钮
    const handleOperation = (el: any, row: any, type: string) => {
      emit('handleOperation', el, row, type)
    }

    // 点击checkbox
    const handleSelect = (type: string, list: IActive[]) => {
      console.log('%c 🥧 list: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', list)
      const ids = list.map(el => el.id)
      emit('handleTableSelect', ids)
    }
    return () => <>
      <tableComp
        id={props.id}
        data={tableList && tableList.parentTree}
        tableRef={tableRef}
        treeProps={treeProps}
        defaultExpandpandAll={true}
        isSelection={true}
        rowKey={'id'}
        columnData={columnData}
        {...{ onHandleSelect: handleSelect }}
      >

        {{
          actionList: (row: any) => (<div class="option-wapper">
            {
              row.actionList.map((el: any) => {
                return <div key={el.id}>
                  <b>{ el.actionName }</b>
                  <span>({ el.description })</span>
                  <el-button type="text" style="color:#409eff" onClick={() => handleOperation(el, row, 'edit')}>[编辑]</el-button>
                  <el-button type="text" style="color:red" onClick={() => handleOperation(el, row, 'delete')}>[删除]</el-button>
                </div>
              })
            }
          </div>)
        }}
      </tableComp>
    </>
  }
})
</script>

<style lang="scss" scoped>
.option-wapper {
  @include flex-center(space-between, center);
}
</style>
