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
>>>>>>> b0b1703a805d03d3a4d97270fa3ebbc17a91f8b8
});
