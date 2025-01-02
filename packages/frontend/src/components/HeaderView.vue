<script setup lang="ts">
const userName = 'ユーザー名'; // props または store から取得
</script>

<template>
  <q-header class="header">
    <nav class="nav-container">
      <div class="logo-section">
        <h1>日程調整BOT</h1>
        <span class="subtitle">Schedule Management System</span>
      </div>
      <div class="user-section">
        <span class="user-name">{{ userName }}</span>
      </div>
    </nav>
  </q-header>
</template>

<style scoped>
.header {
  background: linear-gradient(135deg, #1b4332, #2d6a4f);
  color: white;
  padding: 1rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo-section h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
  font-family: 'Roboto', sans-serif;
}

.user-section {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
}
</style>
