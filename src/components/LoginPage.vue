<script setup>
import { ref } from 'vue'
import { Mail, Lock } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { userApi } from '@/services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const goToHome = () => {
  router.push('/')
}

const goToRegister = () => {
  router.push('/register')
}

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '이메일과 비밀번호를 모두 입력해주세요.'
    return
  }
  
  try {
    console.log('로그인 시도:', { email: email.value, password: password.value });
    const response = await userApi.login({
      email: email.value,
      password: password.value
    })
    console.log('로그인 성공:', response);
    router.push('/') // 로그인 성공 시 홈으로 이동
  } catch (error) {
    console.error('로그인 실패:', error);
    errorMessage.value = error.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
  }
}
</script>

<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goToHome" style="cursor: pointer;" />
        </div>
        <button @click="goToHome" class="primary-button">
          홈으로 이동
        </button>
      </div>
    </nav>

    <div class="login-container">
      <div class="form-container">
        <h1 class="section-title">로그인</h1>

        <form @submit.prevent="login" class="login-form">
          <div v-if="errorMessage" class="alert error">
            {{ errorMessage }}
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

          <div class="forgot-password">
            <a href="#" class="link">비밀번호를 잊으셨나요?</a>
          </div>

          <button type="submit" class="primary-button w-full">로그인</button>
        </form>

        <div class="register-link">
          <p>아직 회원이 아니신가요? <a @click="goToRegister" class="link">회원가입</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  margin-top: 2rem;
}

.forgot-password {
  text-align: right;
  margin-bottom: 1rem;
}

.register-link {
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

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-secondary);
}
</style>
