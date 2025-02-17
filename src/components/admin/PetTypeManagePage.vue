<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">반려동물 타입 관리</h1>
        <div class="nav-buttons">
          <button @click="goToPetSitters" class="secondary-button">
            <Users class="button-icon" />
            펫시터 관리
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

      <!-- Add New Pet Type Form -->
      <div class="form-container">
        <h2 class="section-title">{{ editingId ? '반려동물 타입 수정' : '새 반려동물 타입 추가' }}</h2>
        <form @submit.prevent="handleSubmit" class="add-form">
          <div class="form-group">
            <label class="form-label">타입 이름</label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="예: 강아지, 고양이"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">코드</label>
            <input
              v-model="form.code"
              type="text"
              class="form-input"
              placeholder="예: DOG, CAT"
              required
            />
          </div>
          <div class="button-group">
            <button type="submit" class="primary-button">
              <Save class="icon" />
              {{ editingId ? '수정하기' : '추가하기' }}
            </button>
            <button v-if="editingId" type="button" @click="cancelEdit" class="secondary-button">
              <X class="icon" />
              취소
            </button>
          </div>
        </form>
      </div>

      <!-- Pet Types List -->
      <div class="list-container">
        <h2 class="section-title">반려동물 타입 목록</h2>
        <div class="pet-types-grid">
          <div v-for="petType in petTypes" :key="petType.id" class="pet-type-card">
            <div class="pet-type-content">
              <h3>{{ petType.name }}</h3>
              <p class="code-text">코드: {{ petType.code }}</p>
            </div>
            <div class="card-actions">
              <button @click="editPetType(petType)" class="edit-button">
                <Edit class="icon" />
                수정
              </button>
              <button @click="deletePetType(petType.id)" class="delete-button">
                <Trash class="icon" />
                삭제
              </button>
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
import { Edit, Trash, Save, X, Home, Users } from 'lucide-vue-next'
import { petTypeApi } from '@/services/api'

const router = useRouter()
const petTypes = ref([])
const editingId = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  name: '',
  code: ''
})

const resetForm = () => {
  form.value = {
    name: '',
    code: ''
  }
  editingId.value = null
}

const loadPetTypes = async () => {
  try {
    const response = await petTypeApi.getAllPetTypes()
    petTypes.value = response.data
  } catch (error) {
    errorMessage.value = error.message || '반려동물 타입 목록을 불러오는데 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

onMounted(loadPetTypes)

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await petTypeApi.updatePetType(editingId.value, form.value)
      successMessage.value = '반려동물 타입이 수정되었습니다.'
    } else {
      await petTypeApi.createPetType(form.value)
      successMessage.value = '새로운 반려동물 타입이 추가되었습니다.'
    }
    resetForm()
    loadPetTypes()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || (editingId.value
      ? '반려동물 타입 수정에 실패했습니다.'
      : '반려동물 타입 추가에 실패했습니다.')
    
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const editPetType = (petType) => {
  editingId.value = petType.id
  form.value = {
    name: petType.name,
    code: petType.code
  }
}

const cancelEdit = () => {
  resetForm()
}

const deletePetType = async (id) => {
  if (!confirm('정말 이 반려동물 타입을 삭제하시겠습니까?')) {
    return
  }
  
  try {
    await petTypeApi.deletePetType(id)
    successMessage.value = '반려동물 타입이 삭제되었습니다.'
    loadPetTypes()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message || '반려동물 타입 삭제에 실패했습니다.'
    if (error.code === 'JSON_AUTH_ERROR') {
      router.push('/login')
    }
  }
}

const goHome = () => {
  router.push('/')
}

const goToPetSitters = () => {
  router.push('/admin/pet-sitters')
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.navbar {
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
}

.logo-image {
  height: 80px;
  width: auto;
  object-fit: contain;
}

.title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.success {
  background-color: #dcfce7;
  color: #166534;
}

.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.form-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.primary-button, .secondary-button, .edit-button, .delete-button, .nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.secondary-button {
  background-color: #e5e7eb;
  color: var(--text-primary);
}

.nav-button {
  background-color: var(--primary-color);
  color: white;
}

.edit-button {
  background-color: #3b82f6;
  color: white;
}

.delete-button {
  background-color: #ef4444;
  color: white;
}

.pet-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.pet-type-card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pet-type-content h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.code-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (max-width: 640px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .pet-types-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .logo-image {
    height: 60px;
  }
}
</style> 