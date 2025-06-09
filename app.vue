<script setup lang="ts">
const navigationItems = [
  { label: 'Home', to: '/', icon: 'i-heroicons-home' },
  { label: 'About', to: '/about', icon: 'i-heroicons-information-circle' },
  { label: 'Home Page', to: '/home', icon: 'i-heroicons-document-text' }
]
</script>

<template>
  <UApp>
    <NuxtLayout :nav-items="navigationItems">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
