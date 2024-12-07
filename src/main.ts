import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { attachErrorInterceptor } from './helpers/config';


const app = createApp(App);


const errorHandler = (errorMessage: string) => {
  console.error(errorMessage);
}

attachErrorInterceptor(app, errorHandler);


app.mount('#app')

