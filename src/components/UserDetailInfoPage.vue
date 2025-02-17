<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">회원 정보</h1>
        <button @click="goHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="form-container">
        <div class="profile-section">
          <h2 class="section-title">기본 정보</h2>
          <div class="info-group">
            <label class="info-label">
              <User class="icon" />
              이름
            </label>
            <p class="info-value">{{ user.name }}</p>
          </div>

          <div class="info-group">
            <label class="info-label">
              <Mail class="icon" />
              이메일
            </label>
            <p class="info-value">{{ user.email }}</p>
          </div>

          <div class="info-group">
            <label class="info-label">
              <Phone class="icon" />
              전화번호
            </label>
            <p class="info-value">{{ user.phoneNumber }}</p>
          </div>
        </div>

        <div v-if="petsitterStatus.exists && petsitterProfile" class="profile-section">
          <h2 class="section-title">펫시터 정보</h2>
          
          <div class="info-group">
            <label class="info-label">
              <MapPin class="icon" />
              활동 가능 지역
            </label>
            <p class="info-value">{{ petsitterProfile.region }}</p>
          </div>

          <div class="info-group">
            <label class="info-label">
              <Clock class="icon" />
              활동 가능 시간
            </label>
            <p class="info-value">
              {{ petsitterProfile.availableStartTime }} ~ {{ petsitterProfile.availableEndTime }}
            </p>
          </div>

          <div class="info-group">
            <label class="info-label">돌봄 가능한 반려동물</label>
            <div class="pet-types">
              <span v-for="type in petsitterProfile.availablePetTypes" 
                    :key="type" 
                    class="pet-type-tag">
                {{ type }}
              </span>
            </div>
          </div>

          <div class="info-group">
            <label class="info-label">
              <Wallet class="icon" />
              시간당 요금
            </label>
            <p class="info-value">{{ petsitterProfile.price }}원</p>
          </div>
        </div>

        <div v-if="petsitterStatus.exists" class="profile-section">
          <h2 class="section-title">펫시터 상태</h2>
          <div class="info-group">
            <label class="info-label">현재 상태</label>
            <p class="info-value">{{ getPetsitterStatusText(petsitterStatus.status) }}</p>
          </div>
        </div>

        <div class="button-group">
          <button @click="goToUpdate" class="primary-button">
            <Edit class="icon" />
            정보 수정
          </button>
          <button @click="showChangePasswordModal = true" class="secondary-button">
            <Lock class="icon" />
            비밀번호 변경
          </button>
          <button v-if="!petsitterStatus.exists || petsitterStatus.status === 'REJECTED'" 
                  @click="applyPetsitter" 
                  class="primary-button">
            <User class="icon" />
            펫시터 신청
          </button>
          <button v-else-if="petsitterStatus.status === 'ACTIVATED'" 
                  @click="goToPetsitterProfile" 
                  class="primary-button">
            <User class="icon" />
            펫시터 프로필 수정
          </button>
          <button v-else-if="petsitterStatus.status === 'WAITING'" 
                  class="secondary-button" 
                  disabled>
            <Clock class="icon" />
            승인 대기 중
          </button>
          <button @click="handleWithdraw" class="delete-button">
            회원 탈퇴
          </button>
          <button @click="goToReservationManage" class="primary-button">
            예약 관리
          </button>
          <button @click="goToUserReservations" class="primary-button">
            예약 목록 보기
          </button>
        </div>
      </div>
    </main>

    <!-- Password Change Modal -->
    <div v-if="showChangePasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="section-title">비밀번호 변경</h3>
        <div class="form-group">
          <label class="form-label">새 비밀번호</label>
          <input v-model="newPassword" type="password" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호 확인</label>
          <input v-model="confirmPassword" type="password" class="form-input" />
        </div>
        <div class="button-group">
          <button @click="showChangePasswordModal = false" class="secondary-button">
            취소
          </button>
          <button @click="changePassword" class="primary-button">
            변경하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Phone, MapPin, Clock, Wallet, Edit, Lock } from 'lucide-vue-next';
import { userApi, petsitterApi } from '@/services/api';

const router = useRouter();

const user = ref({
  name: '',
  email: '',
  phoneNumber: ''
});

const showChangePasswordModal = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const petsitterStatus = ref({
  exists: false,
  status: null
});

const petsitterProfile = ref(null);
const errorMessage = ref('');

const loadUserInfo = async () => {
  try {
    const response = await userApi.getUserInfo()
    user.value = response.data
    await fetchPetsitterStatus()
  } catch (error) {
    errorMessage.value = error.message || '사용자 정보를 불러오는데 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const fetchPetsitterStatus = async () => {
  try {
    const response = await petsitterApi.checkStatus()
    const statusData = response.data
    petsitterStatus.value = {
      exists: statusData.id != null,
      status: statusData.status
    }
    
    if (petsitterStatus.value.exists && petsitterStatus.value.status === 'ACTIVATED') {
      const profileResponse = await petsitterApi.getProfile()
      petsitterProfile.value = {
        region: profileResponse.data.region,
        availableStartTime: profileResponse.data.availableStartTime,
        availableEndTime: profileResponse.data.availableEndTime,
        price: profileResponse.data.price,
        availablePetTypes: profileResponse.data.petTypes
      }
    }
  } catch (error) {
    console.error('펫시터 상태 조회 실패:', error)
  }
}

onMounted(loadUserInfo);

const goHome = () => {
  router.push('/');
};

const goToUpdate = () => {
  router.push('/users/update');
};

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('새 비밀번호가 일치하지 않습니다.');
    return;
  }
  try {
    await userApi.changePassword(newPassword.value);
    alert('비밀번호가 변경되었습니다.');
    showChangePasswordModal.value = false;
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    alert('비밀번호 변경에 실패했습니다.');
  }
};

const handleWithdraw = async () => {
  if (confirm('정말 탈퇴하시겠습니까?')) {
    try {
      await userApi.withdraw();
      router.push('/');
    } catch (error) {
      alert('회원 탈퇴에 실패했습니다.');
    }
  }
};

const applyPetsitter = async () => {
  try {
    await petsitterApi.applyPetsitter()
    alert('펫시터 신청이 완료되었습니다!')
    await fetchPetsitterStatus()
  } catch (error) {
    console.error('펫시터 신청 실패:', error)
    alert('펫시터 신청에 실패했습니다.')
  }
}

const goToPetsitterProfile = () => {
  router.push('/petsitter/profile/edit');
};

const goToReservationManage = () => {
  router.push('/reservations/manage')
}

const goToUserReservations = () => {
  router.push('/users/reservations');
};

const getPetsitterStatusText = (status) => {
  switch (status) {
    case 'ACTIVATED': return '활성'
    case 'REJECTED': return '거절됨'
    default: return '승인 대기'
  }
}
</script>

<style scoped>
.main-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--text-primary);
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-overlay {
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

.modal-content {
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
}

@media (max-width: 640px) {
  .button-group {
    flex-direction: column;
  }
  
  .modal-content {
    margin: 1rem;
  }
}

.delete-button {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.profile-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.pet-types {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.pet-type-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-color);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-button {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}
</style>
