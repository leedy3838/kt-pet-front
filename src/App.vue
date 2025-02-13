<template>
  <div id="app">
    <router-view /> <!-- 현재 라우트에 따라 적절한 컴포넌트를 렌더링 -->
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
:root {
  --primary-color: #fbbf24;
  --primary-hover: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --bg-primary: #f9fafb;
  --bg-secondary: #ffffff;
  --border-color: #e5e7eb;
  --success-bg: #dcfce7;
  --success-text: #166534;
  --error-bg: #fee2e2;
  --error-text: #991b1b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  line-height: 1.5;
}

.container {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.navbar {
  background-color: var(--bg-secondary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.logo-image {
  width: 100px;
  height: auto;
}

.primary-button {
  background-color: var(--primary-color);
  color: var(--text-primary);
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.form-container {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.1);
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.alert.success {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.alert.error {
  background-color: var(--error-bg);
  color: var(--error-text);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
}

@media (max-width: 640px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }

  .form-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
