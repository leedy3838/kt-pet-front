<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" />
        </div>
        <div class="nav-links">
          <!-- 로그인하지 않은 경우 -->
          <template v-if="!isLoggedIn">
            <button @click="goToLogin" class="primary-button">로그인</button>
            <button @click="goToRegister" class="secondary-button">회원가입</button>
          </template>
          <!-- 로그인한 경우 -->
          <template v-else>
            <span class="welcome-text">{{ userName }}님 환영합니다!</span>
            <button @click="goToMypage" class="nav-button">마이페이지</button>
            <button @click="handleLogout" class="nav-button">로그아웃</button>
          </template>
        </div>
      </div>
    </nav>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1>반려동물을 위한 최고의 선택</h1>
          <p>전문 펫시터가 제공하는 맞춤형 돌봄 서비스를 만나보세요</p>
        </div>
      </section>

      <section class="services-section">
        <div class="section-container">
          <h2 class="section-title">우리의 서비스</h2>
          <div class="services-grid">
            <div 
              v-for="service in services" 
              :key="service.title" 
              class="service-card"
              @click="goToService(service.path)"
            >
              <component :is="service.icon" class="service-icon" />
              <h3>{{ service.title }}</h3>
              <p class="service-description">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="promotion-section">
        <div class="section-container">
          <h2 class="section-title">특별한 혜택</h2>
          <div class="promotion-grid">
            <div v-for="item in promotionItems" :key="item.title" class="promotion-card">
              <h3>{{ item.title }}</h3>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} 회사명. 모든 권리 보유.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, ShoppingBag } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { userApi } from '@/services/api'

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')

const promotionItems = ref([
  { title: '홍보 자료', content: '펫 케어 서비스의 특별한 장점과 혜택을 소개합니다.' },
  { title: '홍보 자료', content: '전문 펫시터가 제공하는 맞춤형 돌봄 서비스를 만나보세요.' },
  { title: '홍보 자료', content: '반려동물을 위한 최고의 선택, 저희와 함께하세요.' }
])

const services = ref([
  { 
    title: '펫시터 서비스', 
    icon: User, 
    path: '/petsitters',
    description: '전문 펫시터가 제공하는 맞춤형 돌봄 서비스를 만나보세요.'
  },
  { 
    title: '쇼핑몰 서비스', 
    icon: ShoppingBag, 
    path: '/shop',
    description: '반려동물을 위한 다양한 상품을 만나보세요.'
  }
])

// 로그인 상태 확인 및 사용자 정보 가져오기
onMounted(async () => {
  try {
    const response = await userApi.getUserInfo()
    if (response.data) {
      isLoggedIn.value = true
      userName.value = response.data.name
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    isLoggedIn.value = false
  }
})

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToMypage = () => {
  router.push('/users/info')
}

const handleLogout = async () => {
  try {
    await userApi.logout()
    isLoggedIn.value = false
    userName.value = ''
    router.push('/login')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}

const goToService = (path) => {
  router.push(path)
}
</script>

<style scoped>
.hero-section {
  background-color: var(--primary-color);
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.services-grid, .promotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card, .promotion-card {
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.service-card:hover, .promotion-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  width: 3rem;
  height: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.secondary-button {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--primary-color);
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 1rem;
}

.secondary-button:hover {
  background-color: var(--primary-color);
  transform: translateY(-1px);
}

.welcome-text {
  color: var(--text-primary);
  font-weight: 500;
  margin-right: 1rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: var(--bg-primary);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .services-grid, .promotion-grid {
    grid-template-columns: 1fr;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .welcome-text {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}

.service-description {
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.service-card {
  cursor: pointer;
}
</style>
