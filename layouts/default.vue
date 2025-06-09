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
          class="bg-gray-50 dark:bg-gray-900 w-48 p-4 border-r border-gray-200 dark:border-gray-800
            transition-transform transform lg:translate-x-0 fixed lg:static inset-y-0 z-40
            lg:flex flex-col"
          :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
        >
          <p class="font-bold text-lg mb-4 hidden lg:block">Dashboard</p>
          <nav class="space-y-2">
            <UNavigationMenu
              orientation="vertical"
              :items="props.navItems"
              :ui="{
                link: 'px-4 py-3 text-base',
              }"
            />
          </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-6 lg:ml-48">
          <NuxtPage />
        </main>
      </div>
    </div>
</template>
