// @unocss-include
import { UnuseUI } from 'unuse-ui'
import { createApp } from 'vue'

import App from './App.vue'

import 'unuse-ui/dist/assets/style.css'
import 'uno.css'

createApp(App)
  .use(UnuseUI, { registerComponents: false })
  .mount('#app')
