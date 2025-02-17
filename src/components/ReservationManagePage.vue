<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">예약 관리</h1>
        <button @click="goHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="tabs">
        <button 
          :class="['tab-button', { active: activeTab === 'pending' }]"
          @click="activeTab = 'pending'"
        >
          대기중인 예약
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'all' }]"
          @click="activeTab = 'all'"
        >
          전체 예약
        </button>
      </div>

      <div v-if="loading" class="loading">
        예약 정보를 불러오는 중...
      </div>
      
      <div v-else-if="reservations.length === 0" class="empty-state">
        {{ activeTab === 'pending' ? '대기중인 예약이 없습니다.' : '예약 내역이 없습니다.' }}
      </div>
      
      <div v-else class="reservations-grid">
        <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
          <div class="reservation-info">
            <h3>예약자: {{ reservation.userName }}</h3>
            <p class="time">시간: {{ reservation.startTime }} ~ {{ reservation.endTime }}</p>
            <p class="status">상태: {{ getStatusText(reservation.status) }}</p>
          </div>
          
          <div v-if="reservation.status === 'PENDING'" class="button-group">
            <button 
              @click="handleAccept(reservation.id)" 
              class="accept-button"
            >
              수락
            </button>
            <button 
              @click="handleReject(reservation.id)" 
              class="reject-button"
            >
              거절
            </button>
          </div>
        </div>
      </div>

      <div v-if="showDatePicker" class="date-picker-modal">
        <h3>새 예약 날짜 선택</h3>
        <input type="date" v-model="newDate" />
        <button @click="updateReservationDate">확인</button>
        <button @click="showDatePicker = false">취소</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { reservationApi } from '@/services/api'

const router = useRouter()
const activeTab = ref('pending')
const reservations = ref([])
const loading = ref(false)
const showDatePicker = ref(false)
const newDate = ref('')
const selectedReservation = ref(null)

const fetchReservations = async () => {
  loading.value = true
  try {
    const response = activeTab.value === 'pending' 
      ? await reservationApi.getPendingReservations()
      : await reservationApi.getAllReservations()
    reservations.value = response.data
  } catch (error) {
    console.error('예약 목록 조회 실패:', error)
    alert('예약 목록을 불러오는데 실패했습니다.')
  } finally {
    loading.value = false
  }
}

const handleAccept = async (reservationId) => {
  try {
    await reservationApi.acceptReservation(reservationId)
    alert('예약을 수락했습니다.')
    await fetchReservations()
  } catch (error) {
    console.error('예약 수락 실패:', error)
    alert('예약 수락에 실패했습니다.')
  }
}

const handleReject = async (reservationId) => {
  try {
    await reservationApi.rejectReservation(reservationId)
    alert('예약을 거절했습니다.')
    await fetchReservations()
  } catch (error) {
    console.error('예약 거절 실패:', error)
    alert('예약 거절에 실패했습니다.')
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '대기중',
    'ACCEPTED': '수락됨',
    'REJECTED': '거절됨',
    'COMPLETED': '완료됨'
  }
  return statusMap[status] || status
}

const goHome = () => {
  router.push('/')
}

const updateReservationDate = async () => {
  if (!newDate.value) {
    alert('날짜를 선택해주세요.')
    return
  }
  
  try {
    await reservationApi.updateReservationDate(selectedReservation.value.id, newDate.value)
    alert('예약 날짜가 변경되었습니다.')
    showDatePicker.value = false
    await fetchReservations()
  } catch (error) {
    console.error('예약 날짜 변경 실패:', error)
    alert('예약 날짜 변경에 실패했습니다.')
  }
}

watch(activeTab, fetchReservations)

onMounted(fetchReservations)
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.reservation-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reservation-info h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.date, .time, .status {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.accept-button, .reject-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accept-button {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.reject-button {
  background-color: var(--error-bg);
  color: var(--error-text);
}

.loading, .empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.date-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
</style> 