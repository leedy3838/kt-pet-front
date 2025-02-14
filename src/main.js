import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 라우터 임포트
import './assets/common.css';  // 추가

const app = createApp(App);
app.use(router); // 라우터 사용
app.mount('#app');
