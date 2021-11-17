import { createApp } from 'vue'
export default function useLoading(Comp: any): any {
  return {
    mounted(el: any, binding: any) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      const name = Comp?.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      // const title = binding.arg
      console.log('%c 🥘 instance: ', 'font-size:20px;background-color: #FCA650;color:#fff;', instance)
      console.log('%c 🥚 binding: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', binding)
      console.log('%c 🍠 el: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', el[name])
    }
  }
}
