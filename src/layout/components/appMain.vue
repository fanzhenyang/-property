<script lang="tsx">
import { defineComponent, Transition } from 'vue'
export default defineComponent({
  setup () {
    return () => (
      <div class="layout">
        {
          // <Transition name="fade-transform" mode="out-in">
          //   <component is="Component" />
          // </Transition>
        }
        <router-view />

      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
.layout {
  min-height: calc(100vh - 8rem);
  width: 100%;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
