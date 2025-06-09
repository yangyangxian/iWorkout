<script setup lang="ts">
const isSidebarOpen = ref(false)

function closeSidebar() {
  isSidebarOpen.value = false
}

const props = defineProps<{
  navItems: Array<{ label: string; to: string; icon: string }>
}>()
</script>

<template>
    <div class="min-h-screen flex flex-col">
      <!-- Top bar (mobile) -->
      <div class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div class="text-lg font-semibold">Dashboard</div>
        <UButton
          icon="i-heroicons-bars-3-bottom-left"
          color="primary"
          variant="ghost"
          @click="isSidebarOpen = !isSidebarOpen"
        />
      </div>

      <div class="flex flex-1">
        <!-- Overlay for mobile sidebar -->
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 bg-black/50 z-30 lg:hidden"
          @click="closeSidebar"
        ></div>

        <!-- Sidebar -->
        <aside
          class="bg-gray-50 dark:bg-gray-900 w-48 lg:w-54 px-3 py-6 border-r border-gray-200 dark:border-gray-800
            transition-transform transform lg:translate-x-0 fixed lg:static inset-y-0 z-40
            lg:flex flex-col"
          :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
        >
          <span class="font-bold text-2xl pl-4 mb-4 align-top hidden lg:block">Dashboard</span>
          <UNavigationMenu     
            orientation="vertical"
            :items="props.navItems"
            :ui="{
            link: 'px-4 py-2 text-md',
            }"
          />
        </aside>

        <!-- Main content -->
        <main class="py-6 px-6">
          <NuxtPage />
        </main>
      </div>
    </div>
</template>
