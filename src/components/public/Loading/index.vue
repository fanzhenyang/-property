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
          <img src={require('./loading.gif')} alt="加载中"/>
          <p class="desc">{caption.value}</p>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
  .loading {
    position: absolute;
    width: 20%;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .loading-content {
      text-align: center;
      .desc {
        line-height: 20px;
        font-size: 20px;
        color: red;
      }
    }
  }
</style>
