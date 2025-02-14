<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo">
          <img class="logo-image" src="@/assets/logo.webp" alt="Logo" @click="goHome" style="cursor: pointer;" />
        </div>
        <h1 class="title">펫시터 찾기</h1>
        <button @click="goHome" class="primary-button">홈으로 이동</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="petsitter-grid">
        <div 
          v-for="petsitter in petsitters" 
          :key="petsitter.id" 
          class="petsitter-card"
          @click="goToDetail(petsitter.id)"
        >
          <div class="petsitter-info">
            <h3>{{ petsitter.name }}</h3>
            <p class="area">활동지역: {{ petsitter.availableArea }}</p>
            <p class="price">시간당 {{ petsitter.price }}원</p>
            <p class="introduction">{{ petsitter.introduction }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { petsitterApi } from '@/services/api'

const router = useRouter()
const petsitters = ref([])

onMounted(async () => {
  try {
    const response = await petsitterApi.getAllPetsitters()
    petsitters.value = response.data
  } catch (error) {
    console.error('펫시터 목록 조회 실패:', error)
  }
})

const goToDetail = (petsitterId) => {
  router.push(`/petsitter/${petsitterId}`)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.main-content {
  padding: 2rem;
}

.petsitter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.petsitter-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.petsitter-card:hover {
  transform: translateY(-5px);
}

.petsitter-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.area, .price {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.introduction {
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 