<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">펫시터 상세 정보</h1>
        <div class="nav-buttons">
          <button @click="goBack" class="back-button">
            <ArrowLeft class="button-icon" />
            뒤로 가기
          </button>
          <button @click="goHome" class="primary-button">
            <Home class="button-icon" />
            홈으로 이동
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="form-container">
        <div v-if="petsitter" class="petsitter-detail">
          <h2 class="section-title">{{ petsitter.name }} 펫시터</h2>
          
          <div class="info-group">
            <h3 class="info-title">활동 가능 지역</h3>
            <p class="info-content">{{ petsitter.region }}</p>
          </div>

          <div class="info-group">
            <h3 class="info-title">활동 가능 시간</h3>
            <p class="info-content">{{ petsitter.availableStartTime }} ~ {{ petsitter.availableEndTime }}</p>
          </div>

          <div class="info-group">
            <h3 class="info-title">돌봄 가능한 반려동물</h3>
            <div class="pet-types">
              <span 
                v-for="petType in petsitter.petTypes" 
                :key="petType"
                class="pet-type-tag"
              >
                {{ petType }}
              </span>
            </div>
          </div>

          <div class="info-group">
            <h3 class="info-title">시간당 요금</h3>
            <p class="info-content">{{ petsitter.price }}원</p>
          </div>

          <div class="reservation-form">
            <h3 class="form-title">예약하기</h3>
            <div class="form-group">
              <label class="form-label">예약 날짜</label>
              <input
                v-model="reservation.date"
                type="date"
                class="form-input"
                :min="getTodayDate()"
              />
            </div>

            <div class="form-group">
              <label class="form-label">시작 시간</label>
              <input
                v-model="reservation.startTime"
                type="time"
                class="form-input"
                :min="petsitter.availableStartTime"
                :max="petsitter.availableEndTime"
              />
            </div>

            <div class="form-group">
              <label class="form-label">종료 시간</label>
              <input
                v-model="reservation.endTime"
                type="time"
                class="form-input"
                :min="reservation.startTime"
                :max="petsitter.availableEndTime"
              />
            </div>

            <button 
              type="button"
              @click="requestReservation" 
              class="primary-button w-full"
              :disabled="!isValidReservation"
            >
              예약 요청하기
            </button>
          </div>
        </div>
        <div v-else class="loading">
          펫시터 정보를 불러오는 중...
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Home } from 'lucide-vue-next'
import { petsitterApi, reservationApi } from '@/services/api'

const router = useRouter()
const route = useRoute()
const petsitter = ref(null)
const reservation = ref({
  date: '',
  startTime: '',
  endTime: ''
})

const isValidReservation = computed(() => {
  return reservation.value.date && 
         reservation.value.startTime && 
         reservation.value.endTime &&
         reservation.value.startTime < reservation.value.endTime
})

onMounted(async () => {
  try {
    const response = await petsitterApi.getProfile(route.params.id)
    console.log('펫시터 정보:', response.data)
    petsitter.value = response.data
  } catch (error) {
    console.error('펫시터 정보 조회 실패:', error)
    alert('펫시터 정보를 불러오는데 실패했습니다.')
    router.push('/petsitters')
  }
})

const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const requestReservation = async () => {
  if (!isValidReservation.value) {
    alert('예약 정보를 모두 입력해주세요.')
    return
  }

  try {
    const startDateTime = `${reservation.value.date}T${reservation.value.startTime}`
    const endDateTime = `${reservation.value.date}T${reservation.value.endTime}`

    const response = await reservationApi.createReservation({
      petSitterId: Number(route.params.id),
      startTime: startDateTime,
      endTime: endDateTime,
      message: ''
    })

    if (response.data) {
      alert('예약이 요청되었습니다.')
      router.push('/users/info')
    }
  } catch (error) {
    console.error('예약 요청 실패:', error)
    if (error.response?.status === 401) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/login')
    } else {
      alert('예약 요청에 실패했습니다. 다시 시도해주세요.')
    }
  }
}

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.nav-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border: 2px solid var(--primary-color);
  background-color: transparent;
  color: var(--primary-color);
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateX(-2px);
}

.button-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.petsitter-detail {
  padding: 1rem;
}

.info-group {
  margin-bottom: 2rem;
}

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.info-content {
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-line;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.w-full {
  width: 100%;
  margin-top: 2rem;
}

.reservation-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.form-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .nav-buttons {
    flex-direction: column;
    width: 100%;
  }

  .back-button, 
  .primary-button {
    width: 100%;
    justify-content: center;
  }
}

.pet-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pet-type-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
}
</style> 