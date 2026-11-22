import { createApp } from 'vue';
<<<<<<< HEAD
import app from './app.vue';

$(() => {
  createApp(app).mount('#app');
=======
import App from './App.vue';

$(() => {
  const app = createApp(App).use(createPinia());
  app.mount('#app');
  $(window).on('pagehide', () => app.unmount());
>>>>>>> 884ced41021768bed2bf7e03c14e0da9ce08e010
});
