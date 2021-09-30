<script lang="tsx">
import { computed, defineComponent, ref } from 'vue'
import { homeCompairPercent } from '@/api/invest/invest'
import { HomeCompairPercent } from '@/interface/investmentManage'
import Echarts from '@/components/echarts/index.vue'

export default defineComponent({
  setup () {
    const echartsList = ref<HomeCompairPercent[]>([])

    const loading = ref(false)
    const { option, initEcharts } = useEcharts()
    const init = async () => {
      loading.value = true
      const { data } = await homeCompairPercent(null, () => {
        loading.value = false
      })
      echartsList.value = data
      initEcharts(echartsList)
    }
    init()

    const planNum = computed(() => echartsList.value[0]?.plan.toFixed(2))
    const actualNum = computed(() => echartsList.value[0]?.amount.toFixed(2))
    const proportionNum = computed(() => Math.round(echartsList.value[0]?.amount / echartsList.value[0]?.plan * 10000) / 100 + '%')
    return () => (
      <card title='本年累计投资金额占比（亿）' class="investment-card" style={{ height: '100%' }}>
        {{
          cardCont: () => <>
            <div class="echarts-view">
              <div>
                <p class="echarts-view-num">{planNum.value}</p>
                <p class="echarts-view-plan">计划投资总额</p>
              </div>
              <div>
                <p class="echarts-view-num">{actualNum.value}</p>
                <p class="echarts-view-plan">实际投资总额</p>
              </div>
              <div>
                <p class="echarts-view-num">{proportionNum.value}</p>
                <p class="echarts-view-plan">本年累计投资金额占比</p>
              </div>
            </div>
            <Echarts id="Echarts1" options={option.value} width={'100%'} height={'calc(44vh - 9rem)'} />
          </>
        }}
      </card>
    )
  }
})
const useEcharts = () => {
  const option = ref({})
  const initEcharts = (echartsList: {value: HomeCompairPercent[]}) => {
    option.value = {
      color: ['#0D6DE9', '#2BC15D', '#F9CC1F', '#EF4863', '#8544DE', '#12C1C1'],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          return `${params.name}：${params.value.toFixed(2)}亿`
        }
      },
      legend: {
        show: true,
        top: 'middle',
        right: 'right',
        orient: 'vertical',
        textStyle: {
          color: '#ffffff'
        },
        formatter: function (name: string) {
          let target = ''
          echartsList.value.forEach(item => {
            if (name === item.projectTypeName) {
              target = `${name}：${item.amount.toFixed(2)}(${(Math.round(item.amount / item.plan * 10000) / 100)}%)`
            }
          })

          return target
        }
      },
      series: [
        {
          center: ['35%', '50%'],
          radius: ['70%', '60%'],
          type: 'pie',
          clockWise: true, // 顺时加载
          hoverAnimation: false, // 鼠标移入变大
          itemStyle: {
            normal: {
              label: {
                show: false,
                position: 'outside'
              },
              labelLine: {
                show: false,
                length: 100,
                smooth: 0.2
              },
              borderColor: '#0D6DE9',
              shadowColor: 'rgba(0, 0, 0, 0)' // 边框阴影
            }
          },
          data: echartsList.value.map(item => ({ value: item.amount, name: item.projectTypeName }))
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

.echarts-view {
  @include flex-center(space-around);
  color: $fff;
  margin-top: .6rem;
  &-num {
    text-align: center;
    font-size: 2.8rem;
    text-shadow: 0 0 .8rem #195cdc, 0 0 1.5rem #195cdc, 0 0 2.5rem #195cdc, 0 0 4rem #195cdc, 0 0 7rem #195cdc;
  }
  &-plan {
    font-size: 1.2rem;
    margin-top: .2rem;
    text-align: center;
  }
}
</style>
