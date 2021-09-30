<script lang="tsx">
import { defineComponent, onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
type EChartsOption = echarts.EChartsOption
// 定义类型
const PropsType = {
  // 图表唯一 id
  id: String,
  // 图表类名
  className: {
    type: String,
    default: 'chart'
  },
  // 图表宽度
  width: {
    type: String,
    require: true
  },
  // 图表高度
  height: {
    type: String,
    require: true
  },
  // 图表数据项
  options: {
    type: Object,
    default: () => ({})
  },
  // 是否需要开启点击事件
  isClick: {
    type: Boolean,
    default: true
  }
} as const
export default defineComponent({
  props: PropsType,
  setup (props, { emit }) {
    const chartRef = ref<HTMLDivElement | null>(null)
    let echartsData: any = null

    const initEcharts = (val?: EChartsOption) => {
      if (!chartRef.value) {
        return false
      }
      const dom = document.getElementById(props.id as string)
      echartsData = echarts.init(dom as HTMLDivElement)

      window.addEventListener('resize', () => {
        echartsData.resize()
      })

      echartsData.setOption(val || props.options)
    }

    onMounted(() => {
      initEcharts()
      nextTick(() => {
        watch(() => props.options, val => {
          initEcharts(val)
        }, { deep: true })
      })
    })

    onBeforeUnmount(() => {
      echartsData.dispose()
      window.removeEventListener('resize', () => {
        echartsData.resize()
      })
      echartsData = null
    })

    return () => {
      const { id, className, height, width } = props
      return <div ref={chartRef} id={id as string} class={className as string} style={{ height: height as string, width: width as string }}/>
    }
  }
})
</script>
