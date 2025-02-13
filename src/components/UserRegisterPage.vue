<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goToHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">회원가입</h1>
        <button @click="goToHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <div class="register-container">
      <div class="form-container">
        <h2 class="section-title">회원 정보 입력</h2>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div v-if="errorMessage" class="alert error">
            {{ errorMessage }}
          </div>

          <div class="form-group">
            <label class="form-label">
              <User class="icon" />
              이름
            </label>
            <input
              v-model="name"
              type="text"
              class="form-input"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Mail class="icon" />
              이메일
            </label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Lock class="icon" />
              비밀번호
            </label>
            <input
              v-model="password"
              type="password"
              class="form-input"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Lock class="icon" />
              비밀번호 확인
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <Phone class="icon" />
              전화번호
            </label>
            <input
              v-model="phone"
              type="tel"
              class="form-input"
              placeholder="전화번호를 입력하세요"
              required
            />
          </div>

          <button type="submit" class="primary-button w-full">회원가입</button>
        </form>

        <div class="login-link">
          <p>이미 계정이 있으신가요? <a @click="goToLogin" class="link">로그인</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Mail, Lock, Phone } from 'lucide-vue-next'
import { userApi } from '@/services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phone = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => {
  return name.value && email.value && password.value && confirmPassword.value && password.value === confirmPassword.value
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    errorMessage.value = '모든 필드를 올바르게 입력해주세요.'
    return
  }

  try {
    console.log('회원가입 시도:', {
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value
    });
    
    const response = await userApi.register({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value
    })
    
    console.log('회원가입 성공:', response);
    alert('회원가입이 완료되었습니다!')
    router.push('/login')
  } catch (error) {
    console.error('회원가입 실패:', error);
    errorMessage.value = error.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
  }
}

const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.register-form {
  margin-top: 2rem;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.link:hover {
  color: var(--primary-hover);
}

.w-full {
  width: 100%;
}
</style>
