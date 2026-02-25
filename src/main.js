import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)
console.log('Vue App Mounting with Router:', router)
app.use(createPinia())
app.use(router)
app.mount('#app')
