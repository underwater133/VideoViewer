import { createApp } from 'vue'
import "./style.css"
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/scss/theme.scss'

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
