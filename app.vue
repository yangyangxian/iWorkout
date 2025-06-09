<script setup lang="ts">
const navigationItems = [
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'About', to: '/about', icon: 'i-heroicons-information-circle' }
]
</script>

<template>
  <UApp>
    <NuxtLayout :nav-items="navigationItems">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
