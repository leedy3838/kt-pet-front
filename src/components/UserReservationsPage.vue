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
            <p>가격: {{ reservation.price }}원</p>
            <button 
              v-if="reservation.status === 'PENDING'" 
              @click="cancelReservation(reservation.id)" 
              class="cancel-button"
            >
              예약 취소
            </button>
            <p v-if="reservation.status === 'REJECTED'" class="rejected-text">예약이 거부되었습니다.</p>
            <button 
              v-if="reservation.status === 'ACCEPTED' && !reservation.isPayed" 
              @click="onPayment(reservation)" 
              class="payment-button"
            >
              결제하기
            </button>
            <p v-if="reservation.isPayed" class="payment-status">결제가 완료되었습니다.</p>
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

const cancelReservation = async (reservationId) => {
  const confirmCancel = confirm('정말로 이 예약을 취소하시겠습니까?');
  if (!confirmCancel) return;

  try {
    await reservationApi.rejectReservation(reservationId);
    alert('예약이 취소되었습니다.');
    await fetchUserReservations(); // Refresh the reservation list
  } catch (error) {
    console.error('예약 취소 실패:', error);
    alert('예약 취소에 실패했습니다. 다시 시도해주세요.');
  }
};

const onPayment = async (reservation) => {
  const { IMP } = window;
  IMP.init('imp36277135'); // Use the provided merchant identifier

  const data = {
    pg: 'uplus', // Use the registered PG channel
    pay_method: 'card', // Payment method
    merchant_uid: `mid_${new Date().getTime()}`, // Order number
    amount: reservation.price, // Use the price from the reservation
    name: '펫시터 예약 결제', // Order name
    buyer_name: '홍길동', // Buyer name
    buyer_tel: '01012341234', // Buyer phone number
    buyer_email: 'baroq8@gmail.com', // Buyer email
    buyer_addr: '신사동 661-16', // Buyer address
    buyer_postcode: '06018' // Buyer postal code
  };

  IMP.request_pay(data, async (response) => {
    const { success, error_msg, merchant_uid } = response;
    console.log(response);
    if (success) {
      alert('결제 성공');
      // Save the payment ID and reservation ID to the server
      try {
        await reservationApi.savePayment({
          paymentId: merchant_uid, // Use the merchant_uid as the payment ID
          reservationId: reservation.id
        });
        alert('결제 정보가 저장되었습니다.');
      } catch (error) {
        console.error('결제 정보 저장 실패:', error);
        alert('결제 정보를 저장하는 데 실패했습니다.');
      }
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  });
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
.cancel-button {
  background-color: var(--error-bg);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.cancel-button:hover {
  background-color: var(--error-bg-dark);
}
.rejected-text {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
.payment-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.payment-button:hover {
  background-color: var(--primary-color-dark);
}
.payment-status {
  color: var(--success-text);
  margin-top: 0.5rem;
}
</style> 