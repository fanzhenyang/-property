import { createApp } from 'vue'
import App from './App'
import { router } from './router'
import store from './store'
import Element from './plugins/elemntComponents'
import loadingDirective from './components/public/Loading/index'
import { global } from '@/utils/global'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import './styles/index.scss'

const app = createApp(App)
Element(app)
global(app)
app.use(store).directive('loading', loadingDirective).use(router).mount('#app')
