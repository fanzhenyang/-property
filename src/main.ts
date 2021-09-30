import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import Element from './plugins/elemntComponents'
import { global } from '@/utils/global'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import './styles/index.scss'

const app = createApp(App)
Element(app)
global(app)
app.use(store).use(router).mount('#app')
