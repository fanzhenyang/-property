<script lang="tsx">
import { defineComponent, ref } from 'vue'
import * as echarts from 'echarts'
import Echarts from '@/components/echarts/index.vue'

export default defineComponent({
  setup () {
    const loading = ref(false)
    const { option, initEcharts } = useEcharts()
    const init = async () => {
      loading.value = true
      await initEcharts()
    }
    init()

    return () => (
      <card title='铁投集团成立前后资本金出资变化' class="investment-card" style={{ height: '100%' }}>
        {{
          cardCont: () => <>
            <Echarts id="EchartsCapital" options={option.value} width={'100%'} height={'calc(44vh - 9rem)'} />
          </>
        }}
      </card>
    )
  }
})
const useEcharts = () => {
  const option = ref({})
  const initEcharts = () => {
    const xData = ['2016年', '2017年', '2018年', '2019年', '2020年', '2021年']
    const line = [21.89, 25.1, 20.07, 40.2, 74.03, 89]
    option.value = {
      tooltip: {
        trigger: 'item',
        padding: 1,
        formatter: function (param: any) {
          const resultTooltip =
                "<div style='background:rgba(13,5,30,.6);border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;'>" +
                "<div style='padding-top:5px;'>" +
                "<span style='color: #fff'> " + param.name + ': </span>' +
                "<span style='color: #fff'>" + param.value + '</span>' +
                '</div>' +
                '</div>'
          return resultTooltip
        }
      },
      grid: {
        left: '5%',
        top: '10%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      legend: {
        show: true,
        icon: 'circle',
        orient: 'horizontal',
        top: '1%',
        right: 'center',
        itemWidth: 16.5,
        itemHeight: 6,
        data: ['资本金出资金额'],
        itemGap: 30,
        textStyle: {
          // color: '#FFFFFF'
          color: '#C9C8CD',
          fontSize: 14
        }
      },
      xAxis: [{
        data: xData,
        axisLabel: {
          color: '#00c7ff',
          fontSize: 14,
          margin: 30 // 刻度标签与轴线之间的距离。
        },
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
        boundaryGap: true,
        splitLine: {
          show: false,
          width: 0.08,
          lineStyle: {
            type: 'solid',
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
      series: [
        { // 柱底圆片
          name: '资本金出资金额',
          type: 'pictorialBar',
          symbolSize: [60, 20],
          symbolOffset: [0, 10],
          z: 12,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(89,211,255,1)'
              },
              {
                offset: 1,
                color: 'rgba(23,237,194,1)'
              }
              ])
            }
          },
          data: line
        },

        // 柱体
        {
          name: '资本金出资金额',
          type: 'bar',
          barWidth: 60,
          barGap: '0%',
          itemStyle: {
            normal: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: 'linear',
                global: false,
                colorStops: [{ // 第一节下面
                  offset: 0,
                  color: 'rgba(0,255,245,0.5)'
                }, {
                  offset: 1,
                  color: '#43bafe'
                }]
              }
            }
          },

          data: line
        },

        // 柱顶圆片
        {
          name: '资本金出资金额',
          type: 'pictorialBar',
          symbolSize: [60, 20],
          symbolOffset: [0, -10],
          z: 12,
          symbolPosition: 'end',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
                [{
                  offset: 0,
                  color: 'rgba(89,211,255,1)'
                },
                {
                  offset: 1,
                  color: 'rgba(23,237,194,1)'
                }
                ],
                false
              ),
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#ffc000'
                }
              }
            }
          },
          data: line
        }
      ]
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
