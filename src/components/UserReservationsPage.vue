<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">내 예약 목록</h1>
        <button @click="goHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <main class="main-content">
      <div v-if="loading" class="loading">예약 정보를 불러오는 중...</div>
      <div v-else-if="reservations.length === 0" class="empty-state">현재 예약이 없습니다.</div>
      <div v-else>
        <h2 class="section-title">내 예약 목록</h2>
        <div class="reservations-grid">
          <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
            <h3>예약자: {{ reservation.userName }}</h3>
            <p>예약 시간: {{ formatDate(reservation.startTime) }} ~ {{ formatDate(reservation.endTime) }}</p>
            <p>상태: {{ reservation.status }}</p>
            <p>메시지: {{ reservation.message }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { reservationApi } from '@/services/api';

const router = useRouter();
const reservations = ref([]);
const loading = ref(false);

const fetchUserReservations = async () => {
  loading.value = true;
  try {
    const response = await reservationApi.getUserReservations();
    reservations.value = response.data;
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    alert('예약 목록을 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleString();
};

onMounted(fetchUserReservations);

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.main-content {
  padding: 2rem;
}
.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.reservation-card {
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}
.loading {
  text-align: center;
  padding: 2rem;
}
</style> 