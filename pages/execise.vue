<script setup lang="ts">
interface Exercise {
  id: number;
  exerciseName: string;
  muscle: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string;
}

// Search functionality
const searchQuery = ref('');
const selectedCategory = ref('All');

// Filter options
const categoryOptions = [
  { label: 'All Categories', value: 'All' },
  { label: 'Bodyweight', value: 'Bodyweight' },
  { label: 'Weights', value: 'Weights' }
];

// Computed filtered exercises
const filteredExercises = computed(() => {
  let filtered = exercises;
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(exercise => 
      exercise.exerciseName.toLowerCase().includes(query) ||
      exercise.muscle.toLowerCase().includes(query) ||
      exercise.category.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(exercise => exercise.category === selectedCategory.value);
  }
  
  return filtered;
});

// Table columns for the DataTable component
const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'exerciseName', label: 'Exercise Name', sortable: true },
  { key: 'muscle', label: 'Target Muscles', sortable: true, class: 'max-w-xs' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'difficulty', label: 'Difficulty', sortable: true },
  { key: 'equipment', label: 'Equipment', sortable: true }
];

// Helper function to get badge color based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Weights': return 'primary';
    case 'Bodyweight': return 'success';
    default: return 'neutral';
  }
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'success';
    case 'Intermediate': return 'warning';
    case 'Advanced': return 'error';
    default: return 'neutral';
  }
};

// Sample exercise data
const exercises: Exercise[] = [
  {
    id: 1,
    exerciseName: 'Push-ups',
    muscle: 'Chest, Shoulders, Triceps',
    category: 'Bodyweight',
    difficulty: 'Beginner',
    equipment: 'None'
  },
  {
    id: 2,
    exerciseName: 'Squats',
    muscle: 'Quadriceps, Glutes',
    category: 'Bodyweight',
    difficulty: 'Beginner',
    equipment: 'None'
  },
  {
    id: 3,
    exerciseName: 'Bench Press',
    muscle: 'Chest, Shoulders, Triceps',
    category: 'Weights',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench'
  },
  {
    id: 4,
    exerciseName: 'Deadlift',
    muscle: 'Back, Glutes, Hamstrings',
    category: 'Weights',
    difficulty: 'Advanced',
    equipment: 'Barbell'
  },
  {
    id: 5,
    exerciseName: 'Pull-ups',
    muscle: 'Back, Biceps',
    category: 'Bodyweight',
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar'
  },
  {
    id: 6,
    exerciseName: 'Dumbbell Rows',
    muscle: 'Back, Biceps',
    category: 'Weights',
    difficulty: 'Intermediate',
    equipment: 'Dumbbells'
  },
  {
    id: 7,
    exerciseName: 'Planks',
    muscle: 'Core, Shoulders',
    category: 'Bodyweight',
    difficulty: 'Beginner',
    equipment: 'None'
  },
  {
    id: 8,
    exerciseName: 'Burpees',
    muscle: 'Full Body',
    category: 'Bodyweight',
    difficulty: 'Advanced',
    equipment: 'None'
  }
];
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Exercise Library</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Discover and explore various exercises for your workout routine</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <UInput
          v-model="searchQuery"
          placeholder="Search exercises..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="w-full"
        />
      </div>
      <div>
        <USelectMenu
          v-model="selectedCategory"
          :options="categoryOptions"
          placeholder="Select category"
          size="lg"
          class="w-full"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exercises</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ exercises.length }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Icon name="i-heroicons-fire" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bodyweight</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ exercises.filter(e => e.category === 'Bodyweight').length }}</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Icon name="i-heroicons-user" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>
      
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">With Weights</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ exercises.filter(e => e.category === 'Weights').length }}</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <Icon name="i-heroicons-trophy" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Exercise Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Exercises 
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({{ filteredExercises.length }} {{ filteredExercises.length === 1 ? 'result' : 'results' }})
            </span>
          </h2>
        </div>
      </template>

      <DataTable 
        :data="filteredExercises" 
        :columns="tableColumns"
        default-sort="exerciseName"
        :show-actions="false"
      >
        <!-- Custom cell for exercise name -->
        <template #exerciseName-cell="{ value }">
          <div class="font-medium text-gray-900 dark:text-white">
            {{ value }}
          </div>
        </template>

        <!-- Custom cell for muscle groups -->
        <template #muscle-cell="{ value }">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ value }}
          </div>
        </template>

        <!-- Custom cell for category with badge -->
        <template #category-cell="{ value }">
          <UBadge
            :color="getCategoryColor(value)"
            variant="soft"
            size="sm"
          >
            {{ value }}
          </UBadge>
        </template>
        
        <!-- Custom cell for difficulty with badge -->
        <template #difficulty-cell="{ value }">
          <UBadge
            :color="getDifficultyColor(value || 'Beginner')"
            variant="soft"
            size="sm"
          >
            {{ value || 'Beginner' }}
          </UBadge>
        </template>

        <!-- Custom cell for equipment -->
        <template #equipment-cell="{ value }">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ value || 'None' }}
          </div>
        </template>

        <!-- Custom empty state -->
        <template #empty>
          <Icon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No exercises found</h3>
          <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </template>
      </DataTable>
    </UCard>
  </div>
</template>