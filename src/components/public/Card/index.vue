<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  inheritAttrs: false,
  setup (props, { slots, attrs }) {
    return () => (
      <section class={['card', attrs.class]}>
        <header class="card-header">
          <img src={require('@/assets/img/card/train.png')} alt="" />
          <div class="card-header-title">
            {attrs.title}
          </div>
        </header>
        <div>
          {/* 具名插槽cont */}
          {slots.cardCont && slots.cardCont()}
        </div>
      </section>
    )
  }
})
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  background: url("../../../assets/img/card/card_bg.png") no-repeat center center;
  background-size: 100% 100%;
  padding: 1rem;
  box-sizing: border-box;
  &-header {
    @include flex-center(flex-start, flex-end);
    &-title {
      color: $title;
      font-size: 2rem;
      margin-left: 2rem;
    }
  }
}
</style>
