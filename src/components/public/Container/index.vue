<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Container',
  inheritAttrs: false,
  setup (props, { slots, attrs }) {
    const url = Number(attrs.imgIndex) === 1 ? require('@/assets/img/home/bg.png') : Number(attrs.imgIndex) === 2 ? require('@/assets/img/home/full_bg.png') : require('@/assets/img/home/bg.png')
    if (url) {
      return () => (
        <div class={['container', attrs.class]} style={{ background: `url(${url}) no-repeat center center / 100% 100%` }}>
          {/* 具名插槽cont */}
          {slots.cont && slots.cont()}
        </div>
      )
    } else {
      return () => (
        <div class="container">
          {/* 具名插槽cont */}
          {slots.cont && slots.cont()}
        </div>
      )
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  padding: 1rem;
  box-sizing: border-box;
  min-height: calc(100vh - 8.5vh);
  max-height: 100vh;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
