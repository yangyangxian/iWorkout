<script setup lang="ts">
const navigationItems = [
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'Workout Plan', to: '/workoutPlan', icon: 'i-heroicons-bars-3' },
  { label: 'Execise', to: '/execise', icon: 'i-heroicons-cog-6-tooth' }
]
</script>

<template>
  <UApp>
    <NuxtLayout :nav-items="navigationItems">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
