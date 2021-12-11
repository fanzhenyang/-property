<script lang="tsx">
import { defineComponent } from 'vue'
import InvestmentProjects from './components/InvestmentProjects.vue'
import InvestmentCompairPercentEcharts from './components/InvestmentCompairPercentEcharts.vue'
import InvestmentChangesCapital from './components/InvestmentChangesCapital.vue'
import InvestmentChangesContrast from './components/InvestmentChangesContrast.vue'
import InvestmentMonthEcharts from './components/InvestmentMonthEcharts.vue'
import InvestmentYearEcharts from './components/InvestmentYearEcharts.vue'
export default defineComponent({
  setup () {
    return () => (
      <container imgIndex={1} class="inverstment-cont">
        {{
          cont: () => <>
            {
              // 左边
            }
            <div class="inverstment-cont-view">
              <InvestmentProjects />
              <InvestmentCompairPercentEcharts />
            </div>
            {
              // 中间
            }
            <div class="inverstment-cont-main">
              <InvestmentChangesCapital />
              <InvestmentChangesContrast />
            </div>
            {
              // 右边
            }
            <div class="inverstment-cont-view">
              <InvestmentMonthEcharts />
              <InvestmentYearEcharts />
            </div>
          </>
        }}
      </container>
    )
  }
})
</script>

<style lang="scss" scoped>
.inverstment-cont {
  @include flex-center(space-between, flex-end);
  &-view {
    width: 26vw;
    @include flex-center(space-between, flex-end, nowrap, column);
    min-height: calc(100vh - 10rem);
  }
  &-main {
    width: 46vw;
    @include flex-center(space-between, flex-end, nowrap, column);
    min-height: calc(100vh - 10rem);
  }
}
</style>
