<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">펫시터 프로필</h1>
        <button @click="goHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <main class="main-content">
      <!-- Alert Messages -->
      <div v-if="successMessage" class="alert success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error">
        {{ errorMessage }}
      </div>

      <div class="form-container">
        <h2 class="section-title">
          {{ isNewProfile ? '펫시터 프로필 등록' : '펫시터 프로필 수정' }}
        </h2>
        
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label class="form-label">활동 가능 지역</label>
            <input
              v-model="profile.region"
              type="text"
              class="form-input"
              placeholder="예: 서울시 강남구"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">돌봄 가능한 반려동물</label>
            <div class="checkbox-group">
              <label 
                v-for="type in petTypes" 
                :key="type.id" 
                class="checkbox-label"
              >
                <input 
                  type="checkbox" 
                  :value="type.id"
                  v-model="profile.petTypeIds"
                > 
                {{ type.name }}
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">활동 가능 시간</label>
            <div class="time-inputs">
              <input
                v-model="profile.availableStartTime"
                type="time"
                class="form-input"
              />
              <span>부터</span>
              <input
                v-model="profile.availableEndTime"
                type="time"
                class="form-input"
              />
              <span>까지</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">시간당 요금 (원)</label>
            <input
              v-model.number="profile.price"
              type="number"
              class="form-input"
              placeholder="시간당 요금을 입력하세요"
            />
          </div>

          <div class="button-group">
            <button type="submit" class="primary-button">
              <Save class="icon" />
              {{ isNewProfile ? '프로필 등록' : '프로필 수정' }}
            </button>
            <button 
              v-if="!isNewProfile" 
              type="button" 
              @click="handleQuit" 
              class="delete-button"
            >
              <X class="icon" />
              펫시터 그만두기
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Save, X } from 'lucide-vue-next'
import { petsitterApi, petTypeApi } from '@/services/api'

const router = useRouter()
const isNewProfile = ref(true)
const profile = ref({
  region: '',
  availableStartTime: '',
  availableEndTime: '',
  price: '',
  petTypeIds: [],
  status: 'ACTIVE'
})

const successMessage = ref('')
const errorMessage = ref('')
const petTypes = ref([])

const fetchPetTypes = async () => {
  try {
    const response = await petTypeApi.getAllPetTypes()
    petTypes.value = response.data
  } catch (error) {
    errorMessage.value = '반려동물 타입 목록을 불러오는데 실패했습니다.'
  }
}

const fetchProfile = async () => {
  try {
    const existsResponse = await petsitterApi.hasProfile()
    isNewProfile.value = !existsResponse.data

    if (!isNewProfile.value) {
      const response = await petsitterApi.getProfile()
      const profileData = response.data
      
      if (profileData.status === 'REJECTED') {
        isNewProfile.value = true
        return
      }

      profile.value = {
        region: profileData.region,
        availableStartTime: profileData.availableStartTime,
        availableEndTime: profileData.availableEndTime,
        price: profileData.price,
        petTypeIds: profileData.petTypeIds || []
      }
    }
  } catch (error) {
    console.error('프로필 조회 실패:', error)
    errorMessage.value = error.message || '프로필 정보 조회에 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

onMounted(async () => {
  try {
    await fetchPetTypes()  // 반려동물 타입 목록 조회
    await fetchProfile()   // 프로필 정보 조회
  } catch (error) {
    console.error('초기 데이터 로딩 실패:', error)
  }
})

const saveProfile = async () => {
  try {
    const profileData = {
      region: profile.value.region,
      availableStartTime: profile.value.availableStartTime,
      availableEndTime: profile.value.availableEndTime,
      price: parseInt(profile.value.price),
      petTypeIds: profile.value.petTypeIds
    }

    if (isNewProfile.value) {
      await petsitterApi.createProfile(profileData)
      successMessage.value = '펫시터 프로필이 등록되었습니다.'
    } else {
      await petsitterApi.updateProfile(profileData)
      successMessage.value = '펫시터 프로필이 수정되었습니다.'
    }

    setTimeout(() => {
      successMessage.value = ''
      router.push('/users/info')
    }, 2000)
  } catch (error) {
    console.error('프로필 저장 실패:', error)
    errorMessage.value = error.message || '프로필 저장에 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const handleQuit = async () => {
  if (confirm('정말 펫시터를 그만두시겠습니까?')) {
    try {
      await petsitterApi.quitPetsitter()
      alert('펫시터 서비스를 종료했습니다.')
      router.push('/')
    } catch (error) {
      alert('펫시터 종료에 실패했습니다.')
    }
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.profile-form {
  margin-top: var(--spacing-lg);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.w-full {
  width: 100%;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  background-color: var(--border-color);
}

.button-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.delete-button {
  background-color: var(--error-bg);
  color: var(--error-text);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.2s ease;
}

.delete-button:hover {
  background-color: var(--error-text);
  color: white;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.success {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.error {
  background-color: var(--error-bg);
  color: var(--error-text);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style> 