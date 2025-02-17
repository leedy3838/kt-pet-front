<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" />
        </div>
        <div class="nav-buttons">
          <div v-if="isLoggedIn" class="user-menu">
            <span class="welcome-text">{{ userName }}님 환영합니다</span>
            <button v-if="isAdmin" @click="goToAdmin" class="admin-button">
              <Settings class="button-icon" />
              관리자
            </button>
            <button @click="goToMypage" class="secondary-button">
              <User class="button-icon" />
              마이페이지
            </button>
            <button @click="handleLogout" class="primary-button">
              <LogOut class="button-icon" />
              로그아웃
            </button>
          </div>
          <div v-else class="auth-buttons">
            <button @click="goToLogin" class="secondary-button">
              <LogIn class="button-icon" />
              로그인
            </button>
            <button @click="goToRegister" class="primary-button">
              <UserPlus class="button-icon" />
              회원가입
            </button>
          </div>
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
import { User, ShoppingBag, Settings, LogIn, LogOut, UserPlus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { userApi } from '@/services/api'

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')
const isAdmin = ref(false)

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
      isAdmin.value = response.data.role === 'ADMIN'
    }
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error)
    if (error.code === 'JSON_AUTH_ERROR') {
      isLoggedIn.value = false
      router.push('/login')
    }
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
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const goToService = (path) => {
  router.push(path)
}

const goToAdmin = () => {
  router.push('/admin/pet-types')
}
</script>

<style scoped>
.user-menu, .auth-buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.welcome-text {
  color: var(--text-primary);
  font-weight: 500;
  margin-right: var(--spacing-sm);
}

.hero-section {
  background-color: var(--primary-light);
  padding: var(--spacing-xl) var(--spacing-md);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 700;
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

.section-title {
  text-align: center;
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 3rem;
  font-weight: 700;
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

.service-card h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.service-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.promotion-card h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.promotion-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.footer {
  background-color: white;
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
}

.admin-button {
  background-color: #3b82f6;  /* 파란색 계열 */
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.admin-button:hover {
  background-color: #2563eb;  /* 더 진한 파란색 */
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .user-menu, .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-sm);
  }

  .welcome-text {
    margin-bottom: var(--spacing-sm);
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .primary-button, .secondary-button, .admin-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
