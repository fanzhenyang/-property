<script lang="tsx">
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'
import { homeCompairPalnAndBudget } from '@/api/invest/invest'
import Echarts from '@/components/echarts/index.vue'
import { HomeYearItem } from '@/interface/investmentManage'

export default defineComponent({
  setup () {
    const loading = ref(false)
    const echartsData = ref<HomeYearItem>()
    const { option, initEcharts } = useEcharts()
    const init = async () => {
      loading.value = true
      const { data } = await homeCompairPalnAndBudget(null, () => {
        loading.value = false
      })
      echartsData.value = data
      initEcharts(echartsData.value)
    }
    init()

    return () => (
      <card title='本年度计划投资与实际投资对比' class="investment-card" style={{ height: '100%' }}>
        {{
          cardCont: () => <>
            {
              <Echarts id="EchartsProgressYear" options={option.value} width={'100%'} height={'calc(44vh - 9rem)'} />
            }
          </>
        }}
      </card>
    )
  }
})
const useEcharts = () => {
  const option = ref({})
  const initEcharts = ({ budget, plan }: HomeYearItem) => {
    // x轴
    const xData: string[] = []
    for (let i = 1; i <= 12; i++) {
      xData.push(i + '月')
    }

    // 实际资金数据
    const actualAmount: Array<{name: string, value: number}> = []
    xData.forEach(month => {
      const item = budget.find(el => parseInt(el.month) === parseInt(month))
      if (item) {
        actualAmount.push({ name: month, value: item.amount })
      } else {
        actualAmount.push({ name: month, value: 0 })
      }
    })

    // 计划资金
    const planAmout: Array<{name: string, value: number}> = []
    planAmout[0] = { value: plan.jan, name: xData[0] }
    planAmout[1] = { value: plan.fan, name: xData[1] }
    planAmout[2] = { value: plan.mar, name: xData[2] }
    planAmout[3] = { value: plan.apr, name: xData[3] }
    planAmout[4] = { value: plan.may, name: xData[4] }
    planAmout[5] = { value: plan.jun, name: xData[5] }
    planAmout[6] = { value: plan.jul, name: xData[6] }
    planAmout[7] = { value: plan.aug, name: xData[7] }
    planAmout[8] = { value: plan.sep, name: xData[8] }
    planAmout[9] = { value: plan.oct, name: xData[9] }
    planAmout[10] = { value: plan.nov, name: xData[10] }
    planAmout[11] = { value: plan.dect, name: xData[11] }

    const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF'] as const
    const targetList = [
      {
        name: '计划资金',
        color: '#9effff',
        color2: '#9E87FF',
        shadowColor: 'rgba(158,135,255, 0.3)',
        data: planAmout
      },
      {
        name: '实际资金',
        color: '#73DD39',
        color2: '#73DDFF',
        shadowColor: 'rgba(115,221,255, 0.3)',
        data: actualAmount
      }
    ] as const

    option.value = {
      legend: {
        icon: 'circle',
        top: '5%',
        right: '5%',
        itemWidth: 6,
        itemGap: 20,
        textStyle: {
          color: '#00c7ff'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          label: {
            show: true,
            backgroundColor: '#fff',
            color: '#556677',
            borderColor: 'rgba(0,0,0,0)',
            shadowColor: 'rgba(0,0,0,0)',
            shadowOffsetY: 0
          },
          lineStyle: {
            width: 0
          }
        },
        backgroundColor: '#fff',
        textStyle: {
          color: '#5c6c7c'
        },
        padding: [10, 10],
        extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '2%',
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
          interval: 0,
          color: '#00c7ff',
          // 默认x轴字体大小
          fontSize: 12,
          // margin:文字到x轴的距离
          margin: 15
        },
        axisPointer: {
          label: {
            padding: [0, 0, 10, 0],

            margin: 15,
            // 移入时的字体大小
            fontSize: 12,
            color: '#00c7ff',
            backgroundColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#051749' // 0% 处的颜色
              }, {
                // offset: 0.9,
                offset: 0.86,
                color: '#051749' // 0% 处的颜色
              }, {
                offset: 0.86,
                color: '#33c0cd' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#33c0cd' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        },
        boundaryGap: false
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
      series: targetList.map((item, i) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          symbolSize: 1,
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: item.color
            },
            {
              offset: 1,
              color: item.color2
            }
            ]),
            shadowColor: item.shadowColor,
            shadowBlur: 10,
            shadowOffsetY: 20
          },
          itemStyle: {
            normal: {
              color: colorList[i],
              borderColor: colorList[i]
            }
          }
        }
      })
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
