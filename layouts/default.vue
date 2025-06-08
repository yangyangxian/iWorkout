<template>
  <UApp>
    <UContainer class="min-h-screen flex">
      <USidebar class="w-36 border-r border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
        <UNavigationMenu
          orientation="vertical"
          :items="[{ label: 'Home', to: '/', icon: 'i-heroicons-home' }, { label: 'About', to: '/about', icon: 'i-heroicons-information-circle' }]"
        />
      </USidebar>
      <main class="flex-1 p-8">
        <NuxtPage />
      </main>
    </UContainer>
  </UApp>
</template> 