<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // Vue Router 가져오기
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Save
} from 'lucide-vue-next'
import { userApi } from '@/services/api'

const router = useRouter() // 라우터 인스턴스 생성

const userProfile = ref({
  name: '',
  email: '',
  phoneNumber: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPasswordSection = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await userApi.getUserInfo()
    userProfile.value = {
      ...response.data,
      phoneNumber: response.data.phoneNumber
    }
  } catch (error) {
    if (error.response?.status === 401) {
      router.push('/login')
    }
    errorMessage.value = '사용자 정보를 불러오는데 실패했습니다.'
  }
})

const saveProfile = async () => {
  try {
    await userApi.updateUserInfo({
      name: userProfile.value.name,
      phone: userProfile.value.phoneNumber
    })
    successMessage.value = '프로필이 성공적으로 업데이트되었습니다.'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = '프로필 업데이트에 실패했습니다.'
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMessage.value = '새 비밀번호가 일치하지 않습니다.'
    return
  }
  try {
    await userApi.changePassword(passwordForm.value.newPassword);
    successMessage.value = '비밀번호가 성공적으로 변경되었습니다.'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    showPasswordSection.value = false
  } catch (error) {
    if (error.response?.status === 401) {
      router.push('/login')
    }
    errorMessage.value = '비밀번호 변경 중 오류가 발생했습니다.'
  }
}

const goToMainPage = () => {
  router.push('/') // MainPage.vue로 이동
}
</script>

<template>
  <div class="container">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" />
        </div>
        <h1 class="title">마이페이지</h1>
        <button @click="goToMainPage" class="main-button">
          메인으로 이동
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Alert Messages -->
      <div v-if="successMessage" class="alert success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error">
        {{ errorMessage }}
      </div>

      <div class="content-wrapper">
        <!-- Profile Section -->
        <div class="profile-section">
          <h2 class="section-title">프로필 정보</h2>
          <div class="profile-content">
            <div class="form-container">
              <div class="form-group">
                <label class="form-label">
                  <User class="icon" />
                  이름
                </label>
                <input 
                  v-model="userProfile.name"
                  type="text"
                  class="form-input"
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <Mail class="icon" />
                  이메일
                </label>
                <input 
                  v-model="userProfile.email"
                  type="email"
                  class="form-input"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <Phone class="icon" />
                  전화번호
                </label>
                <input 
                  v-model="userProfile.phoneNumber"
                  type="tel"
                  class="form-input"
                  placeholder="전화번호를 입력하세요"
                />
              </div>
            </div>

            <button 
              @click="saveProfile"
              class="save-button"
            >
              <Save class="icon" />
              프로필 저장
            </button>
          </div>
        </div>

        <!-- Password Change Section -->
        <div class="password-section">
          <h2 class="section-title">비밀번호 관리</h2>
          <div class="password-content">
            <button 
              @click="showPasswordSection = !showPasswordSection"
              class="toggle-button"
            >
              <Lock class="icon" />
              비밀번호 변경
            </button>

            <div v-if="showPasswordSection" class="password-form">
              <div class="form-group">
                <label class="form-label">현재 비밀번호</label>
                <input 
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>

              <div class="form-group">
                <label class="form-label">새 비밀번호</label>
                <input 
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>

              <div class="form-group">
                <label class="form-label">새 비밀번호 확인</label>
                <input 
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>

              <button 
                @click="updatePassword"
                class="update-button"
              >
                비밀번호 변경하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.logo-image {
  width: 100px;
  height: auto;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.main-button {
  background-color: #fbbf24;
  color: #1f2937;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.main-button:hover {
  background-color: #f59e0b;
  transform: translateY(-1px);
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.content-wrapper {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #fbbf24;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.success {
  background-color: #dcfce7;
  color: #166534;
}

.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.profile-section, .password-section {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-container {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.1);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.save-button, .toggle-button, .update-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: #1f2937;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;
}

.save-button {
  background-color: #fbbf24;
}

.save-button:hover {
  background-color: #f59e0b;
  transform: translateY(-1px);
}

.toggle-button {
  background-color: #e5e7eb;
  color: #4b5563;
}

.toggle-button:hover {
  background-color: #d1d5db;
}

.password-form {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}

.update-button {
  background-color: #fbbf24;
}

.update-button:hover {
  background-color: #f59e0b;
}

@media (max-width: 640px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }

  .main-content {
    padding: 1rem;
  }

  .profile-section, .password-section {
    padding: 1.5rem;
  }
}
</style>
