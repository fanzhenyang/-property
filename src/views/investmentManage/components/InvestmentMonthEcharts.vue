<script lang="tsx">
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'
import { homeInvestThisMonth } from '@/api/invest/invest'
import Echarts from '@/components/echarts/index.vue'
import { HomeMothItem } from '@/interface/investmentManage'

export default defineComponent({
  setup () {
    const loading = ref(false)
    const echartsData = ref<Array<HomeMothItem>>([])
    const { option, initEcharts } = useEcharts()
    const init = async () => {
      loading.value = true
      const { data } = await homeInvestThisMonth(null, () => {
        loading.value = false
      })
      echartsData.value = data
      initEcharts(echartsData)
    }
    init()

    return () => (
      <card title='本月投资进度（亿）' class="investment-card" style={{ height: '100%' }}>
        {{
          cardCont: () => <>
            {
              <Echarts id="EchartsProgressMonth" options={option.value} width={'100%'} height={'calc(44vh - 9rem)'} />
            }
          </>
        }}
      </card>
    )
  }
})
const useEcharts = () => {
  const option = ref({})
  const initEcharts = (echartsData: { value: Array<HomeMothItem> }) => {
    const xData: string[] = echartsData.value.map(item => (item.projectName))
    const plansInvest: number[] = echartsData.value.map(item => (item.plan))
    const plansAmount: number[] = echartsData.value.map(item => (item.amount))
    option.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['计划投资', '本月投资进度'],
        align: 'right',
        right: 10,
        textStyle: {
          color: '#fff'
        },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 35
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: xData,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#063374',
            width: 1,
            type: 'solid'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: '#00c7ff',
          interval: 0,
          formatter: function (value: string) {
            let ret = '' // 拼接加\n返回的类目项
            let maxLength = 0 // 每项显示文字个数
            const valLength = value.length// X轴类目项的文字个数
            if (value.length >= 6) {
              maxLength = 4
            } else {
              maxLength = 1
            }
            const rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
            if (rowN > 1) { // 如果类目项的文字大于3,
              for (let i = 0; i < rowN; i++) {
                let temp = ''// 每次截取的字符串
                const start = i * maxLength// 开始截取的位置
                const end = start + maxLength// 结束截取的位置
                // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                temp = value.substring(start, end) + '\n'
                ret += temp // 凭借最终的字符串
              }
              return ret
            } else {
              return value
            }
          }
        }
      }],
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#00c7ff',
            width: 1,
            type: 'solid'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#063374'
          }
        }
      }],
      series: [{
        name: '计划投资',
        type: 'bar',
        data: plansInvest,
        barWidth: 10, // 柱子宽度
        barGap: 1, // 柱子之间间距
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#008cff'
            }, {
              offset: 1,
              color: '#005193'
            }]),
            opacity: 1
          }
        }
      }, {
        name: '本月投资进度',
        type: 'bar',
        data: plansAmount,
        barWidth: 10,
        barGap: 1,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#00da9c'
            }, {
              offset: 1,
              color: '#007a55'
            }]),
            opacity: 1
          }
        }
      }]
    }
  }

  return { initEcharts, option }
}
</script>

<style lang="scss" scoped>
.investment-card {
  height: calc(46vh - 2rem);
}

</style>
