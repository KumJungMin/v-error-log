import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { attachErrorInterceptor } from './helpers/error-log';


const app = createApp(App);


const errorHandler = (error: Error, componentName: string, lifecycleHook: string) => {
  console.table({ 
    errorName: error.name,
    errorMessage: error.message,
    componentName: `${componentName}.vue`, 
    lifecycleHook,
    path: window.location.pathname
  });
}

attachErrorInterceptor(app, errorHandler);


app.mount('#app')

