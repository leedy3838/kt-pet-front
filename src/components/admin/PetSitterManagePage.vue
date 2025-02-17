<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">펫시터 신청 관리</h1>
        <div class="nav-buttons">
          <button @click="goToPetTypes" class="secondary-button">
            <Tag class="button-icon" />
            반려동물 타입 관리
          </button>
          <button @click="goHome" class="primary-button">
            <Home class="button-icon" />
            홈으로 이동
          </button>
        </div>
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

      <!-- Pending PetSitters List -->
      <div class="list-container">
        <h2 class="section-title">펫시터 신청 목록</h2>
        <div v-if="pendingPetSitters.length === 0" class="empty-state">
          <p>현재 승인 대기 중인 펫시터 신청이 없습니다.</p>
        </div>
        <div v-else class="petsitter-grid">
          <div v-for="petsitter in pendingPetSitters" 
               :key="petsitter.petSitterId" 
               class="petsitter-card">
            <div class="petsitter-content">
              <div class="petsitter-header">
                <h3>{{ petsitter.name }}</h3>
                <span class="status-badge" :class="getStatusClass(petsitter.isActivated)">
                  {{ petsitter.isActivated ? '활성' : '대기' }}
                </span>
              </div>
              <div class="info-group">
                <MapPin class="info-icon" />
                <p class="region">활동지역: {{ petsitter.region || '미지정' }}</p>
              </div>
              <div class="info-group">
                <Wallet class="info-icon" />
                <p class="price">시간당 요금: {{ petsitter.price ? `${petsitter.price}원` : '미지정' }}</p>
              </div>
              <div class="pet-types-section">
                <p class="pet-types-label">돌봄 가능한 반려동물:</p>
                <div class="pet-types-container">
                  <span v-for="type in petsitter.availablePetTypes" 
                        :key="type"
                        class="pet-type-tag">
                    {{ type }}
                  </span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button v-if="!petsitter.isActivated"
                      @click="approvePetSitter(petsitter.petSitterId)" 
                      class="approve-button">
                <Check class="button-icon" />
                승인하기
              </button>
              <span v-else class="approved-text">
                <CheckCircle class="approved-icon" />
                승인완료
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home, Tag, Check, MapPin, Wallet, CheckCircle } from 'lucide-vue-next'
import { adminApi } from '@/services/api'

const router = useRouter()
const pendingPetSitters = ref([])
const successMessage = ref('')
const errorMessage = ref('')

const loadPendingPetSitters = async () => {
  try {
    const response = await adminApi.getPendingPetSitters()
    pendingPetSitters.value = response.data.map(petsitter => ({
      petSitterId: petsitter.petSitterId,
      name: petsitter.name || '이름 없음',
      isActivated: petsitter.isActivated,
      region: petsitter.region,
      price: petsitter.price,
      availablePetTypes: petsitter.availablePetTypes || []
    }))
  } catch (error) {
    errorMessage.value = error.message || '펫시터 신청 목록을 불러오는데 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const approvePetSitter = async (petSitterId) => {
  try {
    await adminApi.approvePetSitter(petSitterId)
    successMessage.value = '펫시터 신청이 승인되었습니다.'
    loadPendingPetSitters()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || '펫시터 승인에 실패했습니다.'
  }
}

onMounted(loadPendingPetSitters)

const goHome = () => {
  router.push('/')
}

const goToPetTypes = () => {
  router.push('/admin/pet-types')
}

const getStatusClass = (isActivated) => {
  return isActivated ? 'status-active' : 'status-pending'
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-lg);
}

.petsitter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-active {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.status-pending {
  background-color: var(--warning-bg);
  color: var(--warning-text);
}

.info-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-color);
}

.pet-types-section {
  margin-top: var(--spacing-md);
}

.pet-types-label {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.pet-types-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.approved-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--success-text);
  font-weight: 500;
  justify-content: center;
}

.approved-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--success-text);
}

.petsitter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.petsitter-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.petsitter-content h3 {
  color: var(--text-primary);
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.petsitter-content p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.card-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: auto;
}

.approve-button {
  background-color: #22C55E;
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
  justify-content: center;
}

.approve-button:hover {
  background-color: #16A34A;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 640px) {
  .petsitter-grid {
    grid-template-columns: 1fr;
  }

  .nav-buttons {
    flex-direction: column;
    width: 100%;
    gap: var(--spacing-sm);
  }
}
</style> 