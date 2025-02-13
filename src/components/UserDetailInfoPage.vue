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
            <p class="info-value">{{ user.phone }}</p>
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
            <button @click="handleWithdraw" class="delete-button">
              회원 탈퇴
            </button>
          </div>
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
import { User, Mail, Phone, Lock, Edit } from 'lucide-vue-next';
import { userApi } from '@/services/api';

const router = useRouter();

const user = ref({
  name: '',
  email: '',
  phone: ''
});

const showChangePasswordModal = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');

onMounted(async () => {
  try {
    const response = await userApi.getUserInfo();
    user.value = {
      ...response.data,
      phone: response.data.phoneNumber
    };
  } catch (error) {
    if (error.response?.status === 401) {
      router.push('/login');
    }
    console.error('사용자 정보 조회 실패:', error);
  }
});

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
    await userApi.changePassword({
      currentPassword: '',
      newPassword: newPassword.value
    });
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
</style>
