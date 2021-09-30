<script lang="tsx">
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'
import { homeCompairInvest } from '@/api/invest/invest'
import Echarts from '@/components/echarts/index.vue'
import { HomeCompairInvest } from '@/interface/investmentManage'

export default defineComponent({
  setup () {
    const loading = ref(false)
    const echartsData = ref<HomeCompairInvest>()
    const { option, initEcharts } = useEcharts()
    const init = async () => {
      loading.value = true
      const { data } = await homeCompairInvest(null, () => {
        loading.value = false
      })
      echartsData.value = data
      initEcharts(echartsData.value)
    }
    init()

    return () => (
      <card title='去年与今年投资对比' class="investment-card" style={{ height: '100%' }}>
        {{
          cardCont: () => <>
            {
              <Echarts id="EchartsContrast" options={option.value} width={'100%'} height={'calc(44vh - 9rem)'} />
            }
          </>
        }}
      </card>
    )
  }
})
const useEcharts = () => {
  const option = ref({})
  const initEcharts = (echartsData: HomeCompairInvest) => {
    const legendData: string[] = []
    echartsData.thisYear.forEach(item => {
      const i = legendData.findIndex(el => el === item.year)
      if (i === -1) {
        legendData.push(item.year)
      }
    })
    echartsData.lastYear.forEach(item => {
      const i = legendData.findIndex(el => el === item.year)
      if (i === -1) {
        legendData.push(item.year)
      }
    })
    const xDataList: string[] = []
    for (let i = 1; i <= 12; i++) {
      xDataList.push(i + '月')
    }

    option.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: legendData.map(item => `${item}年`),
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
        data: xDataList,
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
          textStyle: {
            color: '#00c7ff'
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
        name: `${echartsData.thisYear[0].year}年`,
        type: 'bar',
        data: echartsData.thisYear.map(item => item.amount),
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
        name: `${echartsData.lastYear[0].year}年`,
        type: 'bar',
        data: echartsData.lastYear.map(item => item.amount),
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
