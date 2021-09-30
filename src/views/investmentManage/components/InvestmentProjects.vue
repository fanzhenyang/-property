<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { homeTopInvest } from '@/api/invest/invest'
import { HomeTop } from '@/interface/investmentManage'
interface HomeTopChild extends HomeTop {
  bgColor: string
}

export default defineComponent({
  setup () {
    const projectList = ref<HomeTopChild[]>([])
    const loading = ref(false)
    const init = async () => {
      loading.value = true
      const { data } = await homeTopInvest({ limitParam: 8 }, () => {
        loading.value = false
      })
      const colorList = ['#dc5168', '#f09918', '#00b5ff', '#06fce2', '#0340ff', '#3F9EFE', '#00B5FF', '#0D6DE9']
      projectList.value = data.map((item, index) => {
        return {
          ...item,
          bgColor: colorList[index]
        }
      })
    }
    init()

    return () => (
      <card title='省列重大铁路项目投资情况' class="investment-card">
        {{
          cardCont: () => <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar__view scrollbar-view-height" style={{ height: 'calc(44vh - 4rem)' }}>
            <ul class="box-ul">
              {
                projectList.value.map((el, index) => {
                  return <LiItem item={el} index={index} key={el.projectName} />
                })
              }
            </ul>
          </el-scrollbar>
        }}
      </card>
    )
  }
})

const LiItem = (props: {item: HomeTopChild, index: number}) => {
  const { item, index } = props
  return (
    <li class="box-ul-li">
      <div class="box-ul-name">
        <div>{item.projectName}</div>
      </div>
      <div class="box-ul-cont">
        <div class="box-ul-index" style={{ background: `${item.bgColor}` }}>
          { index + 1 }
        </div>
        <div class="box-ul-view">
          <div class="box-ul-div" style={{ width: `${item.percent}`, background: `${item.bgColor}` }}>
          </div>
          <div class="box-ul-view-amount">{ item.amount.toFixed(3) }亿</div>
        </div>
        <div class="box-ul-cont-percent">{ item.plan }，{ item.percent }</div>
      </div>
    </li>
  )
}

</script>

<style lang="scss" scoped>
.investment-card {
  height: calc(46vh - 2rem);
}
.box-ul {
  font-size: 1.2rem;
  margin-top: 1rem;
  height: 100%;
  @include flex-center(flex-start, center, nowrap, column);
  &-li {
    width: 100%;
    height: 2.5rem;
    margin-bottom: .2rem;
    cursor: pointer;
    flex: 0 0 9rem;
  }
  /deep/ &-name {
    color: $fff;
    margin-bottom: .5rem;
  }
  /deep/ &-cont {
    @include flex-center(flex-start, center);
    color: $fff;
    &-percent {
      flex: 0 0 22%;
      text-align: right;
    }
  }
  /deep/ &-index {
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    line-height: 2.5rem;
    color: #fff;
    font-size: 2rem;
  }
  /deep/ &-view {
    position: relative;
    flex: 1;
    @include flex-center(flex-start, center);
    margin-left: .5rem;
    background-color: #13265e;
    &-amount {
      @include vertically(topCenter);
      z-index: 2;
      right: 1rem;
    }
  }
  /deep/ &-div {
    width:  100%;
    height: 2.5rem;
    > div {
      height: 100%;
    }
  }
}
</style>
