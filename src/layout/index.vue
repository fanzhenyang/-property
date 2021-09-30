<script lang="tsx">
import Header from '@/components/header/index.vue'
import { defineComponent } from 'vue'
import AppMain from './components/appMain.vue'
export default defineComponent({
  setup () {
    return () => (
      <>
        <Header />
        <AppMain />
      </>
    )
  }
})
</script>

<style lang="scss" scoped>

</style>
