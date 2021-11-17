<script lang="tsx">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Loading',
  setup () {
    const caption = ref<string>('')
    const setTitle = (title: string) => {
      caption.value = title
    }
    return () => (
      <div class="loading">
        <div class="loading-content">
          <img src="./loading.gif" alt="加载中"/>
          <p class="desc">{caption.value}</p>
        </div>
      </div>
    )
  }
})
</script>
