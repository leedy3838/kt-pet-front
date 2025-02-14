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
            <label class="form-label">활동 위치</label>
            <input
              v-model="profile.location"
              type="text"
              class="form-input"
              placeholder="활동 가능한 지역을 입력하세요"
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
  location: '',
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
    // 프로필 존재 여부 확인
    const existsResponse = await petsitterApi.hasProfile()
    isNewProfile.value = !existsResponse.data

    if (!isNewProfile.value) {
      // 기존 프로필이 있는 경우 자신의 프로필 조회
      const response = await petsitterApi.getProfile()
      const profileData = response.data
      console.log('조회된 프로필 데이터:', profileData)

      profile.value = {
        location: profileData.region,
        availableStartTime: profileData.availableStartTime,
        availableEndTime: profileData.availableEndTime,
        price: profileData.price,
        petTypeIds: profileData.petTypes.map(type => type.id)
      }
    }
  } catch (error) {
    console.error('프로필 조회 실패:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
    errorMessage.value = '프로필 정보 조회에 실패했습니다.'
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
    if (isNewProfile.value) {
      await petsitterApi.createProfile(profile.value)
      successMessage.value = '프로필이 성공적으로 등록되었습니다.'
    } else {
      await petsitterApi.updateProfile(profile.value)  // id 제거
      successMessage.value = '프로필이 성공적으로 수정되었습니다.'
    }
    
    isNewProfile.value = false
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('프로필 저장 실패:', error)
    errorMessage.value = isNewProfile.value 
      ? '프로필 등록에 실패했습니다.' 
      : '프로필 수정에 실패했습니다.'
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
  margin-top: 2rem;
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
  gap: 1rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.delete-button {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #dc2626;
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
  gap: 1rem;
}
</style> 