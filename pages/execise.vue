<script setup lang="ts">
interface Exercise {
  id: string;
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

interface DisplayExercise {
  id: string;
  exerciseName: string;
  muscle: string;
  category: string;
  equipment?: string;
  instructions?: string;
  demonstrationImage?: string;
}

// Search functionality
const searchQuery = ref('');
const selectedCategory = ref('All');
const exercises = ref<DisplayExercise[]>([]);
const loading = ref(true);

// Modal state for image popup
const showImageModal = ref(false);
const selectedExercise = ref<DisplayExercise | null>(null);

// Function to open image modal
const openImageModal = (exercise: DisplayExercise) => {
  selectedExercise.value = exercise;
  showImageModal.value = true;
};

// Function to close image modal
const closeImageModal = () => {
  showImageModal.value = false;
  selectedExercise.value = null;
};

// Function to open full size image
const openFullSizeImage = (imageUrl: string) => {
  if (typeof window !== 'undefined') {
    window.open(imageUrl, '_blank');
  }
};

// Handle keyboard events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showImageModal.value) {
    closeImageModal();
  }
};

// Add keyboard event listener
onMounted(() => {
  loadExercises();
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }
});

// Remove event listener on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }
});

// Simple filter options
const categoryOptions = [
  { label: 'All Types', value: 'All' },
  { label: 'Strength', value: 'strength' },
  { label: 'Cardio', value: 'cardio' },
  { label: 'Flexibility', value: 'stretching' },
  { label: 'High Intensity', value: 'plyometrics' }
];

// Simplified exercise name mapping
const exerciseNameMap: Record<string, string> = {
  'push-up': 'Push-ups', 'pushup': 'Push-ups', 'pull-up': 'Pull-ups', 'pullup': 'Pull-ups',
  'chin-up': 'Chin-ups', 'bodyweight squat': 'Squats', 'air squat': 'Squats', 'squat': 'Squats',
  'lunge': 'Lunges', 'walking lunge': 'Walking Lunges', 'reverse lunge': 'Reverse Lunges',
  'side lunge': 'Side Lunges', 'lateral lunge': 'Side Lunges', 'plank': 'Plank', 'side plank': 'Side Plank',
  'burpee': 'Burpees', 'mountain climber': 'Mountain Climbers', 'jumping jack': 'Jumping Jacks',
  'sit-up': 'Sit-ups', 'crunch': 'Crunches', 'russian twist': 'Russian Twists',
  'deadlift': 'Deadlifts', 'bench press': 'Bench Press', 'shoulder press': 'Shoulder Press',
  'bicep curl': 'Bicep Curls', 'tricep dip': 'Tricep Dips', 'bent over row': 'Bent-Over Rows',
  'calf raise': 'Calf Raises', 'leg press': 'Leg Press', 'hip thrust': 'Hip Thrusts',
  'glute bridge': 'Glute Bridges', 'wall sit': 'Wall Sits'
};

// Function to get common exercise name
const getCommonExerciseName = (originalName: string): string => {
  const name = originalName.toLowerCase();
  return exerciseNameMap[name] || originalName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Load exercises from Free Exercise DB
const loadExercises = async () => {
  try {
    loading.value = true;
    const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
    const exerciseData: Exercise[] = await response.json();
    
    // Popular exercises for everyday fitness
    const commonExercises = [
      'push-ups', 'pull-ups', 'squats', 'lunges', 'planks', 'burpees', 'jumping jacks',
      'mountain climbers', 'sit-ups', 'crunches', 'deadlifts', 'bench press', 'tricep dips',
      'shoulder press', 'bicep curls', 'bent-over rows', 'wall sits', 'calf raises',
      'hip thrusts', 'glute bridges', 'russian twists', 'step-ups', 'high knees'
    ];
    
    // Filter for practical exercises with simple equipment
    const filteredExercises = exerciseData.filter(exercise => {
      const name = exercise.name.toLowerCase();
      const equipment = exercise.equipment?.toLowerCase() || '';
      
      const isCommon = commonExercises.some((commonName: string) => 
        name.includes(commonName.toLowerCase()) || getCommonExerciseName(exercise.name) !== exercise.name
      );
      
      const excludedEquipment = ['cable', 'machine', 'leverage', 'smith', 'sled', 'olympic'];
      const hasComplexEquipment = excludedEquipment.some(excluded => equipment.includes(excluded));
      
      const isBodyweight = !exercise.equipment || exercise.equipment === 'body only';
      const hasBasicEquipment = equipment.includes('dumbbell') || equipment.includes('barbell') || equipment.includes('bench');
      
      return isCommon && !hasComplexEquipment && (isBodyweight || hasBasicEquipment);
    });
    
    // Create unique exercises with clean data
    const uniqueExercises = new Map();
    
    filteredExercises.forEach(exercise => {
      const commonName = getCommonExerciseName(exercise.name);
      
      if (!uniqueExercises.has(commonName)) {
        const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles]
          .slice(0, 2)
          .map(muscle => muscle.charAt(0).toUpperCase() + muscle.slice(1))
          .join(', ');
        
        uniqueExercises.set(commonName, {
          id: exercise.id,
          exerciseName: commonName,
          muscle: muscles || 'Full Body',
          category: exercise.category,
          equipment: exercise.equipment?.replace('body only', 'Bodyweight') || 'Bodyweight',
          instructions: exercise.instructions[0]?.substring(0, 100) + '...' || 'Instructions available',
          demonstrationImage: exercise.images[0] 
            ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exercise.images[0]}`
            : undefined
        });
      }
    });
    
    exercises.value = Array.from(uniqueExercises.values())
      .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
      .slice(0, 30);
  } catch (error) {
    console.error('Failed to load exercises:', error);
    // Fallback to empty array if API fails
    exercises.value = [];
  } finally {
    loading.value = false;
  }
};

// Remove event listener on unmount
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }
});

// Computed filtered exercises
const filteredExercises = computed(() => {
  let filtered = exercises.value;
  
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

// Clean table headers (simplified)
const tableColumns = [
  { key: 'exerciseName', label: 'Exercise', sortable: true, class: 'min-w-36 w-48' },
  { key: 'muscle', label: 'Muscles', sortable: true, class: 'min-w-28 w-36' },
  { key: 'category', label: 'Type', sortable: true, class: 'w-24' },
  { key: 'instructions', label: 'Demo', sortable: false, class: 'w-32' },
  { key: 'equipment', label: 'Gear', sortable: true, class: 'min-w-20 w-24' }
];

// Helper function to get badge color based on category
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'strength': return 'primary';
    case 'stretching': return 'success';
    case 'plyometrics': return 'warning';
    case 'cardio': return 'error';
    default: return 'neutral';
  }
};

// Helper function to get fallback demonstration image URL
const getFallbackImage = () => {
  // Simple, clean fallback image for exercises without demonstration images
  return 'https://via.placeholder.com/96x56/E5E7EB/6B7280?text=Exercise';
};
</script>

<template>
  <div class="space-y-6 p-1 max-w-full overflow-hidden animate-in fade-in duration-500">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">💪 Exercise library</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400">Discover effective exercises for your daily workout</p>
    </div>

    <!-- Search and Filter -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
      <div class="md:col-span-3">
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
          placeholder="Select type"
          size="xl"
          class="w-full"
        />
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-3 gap-3 mb-5">
      <UCard class="text-center hover:shadow-md transition-shadow py-2 px-3 border border-gray-200 dark:border-gray-800">
        <div class="text-3xl font-bold text-blue-600 mb-1">{{ exercises.length }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Exercises</div>
      </UCard>
      
      <UCard class="text-center hover:shadow-md transition-shadow py-2 px-3 border border-gray-200 dark:border-gray-800">
        <div class="text-3xl font-bold text-green-600 mb-1">{{ exercises.filter(e => e.equipment === 'Bodyweight').length }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">Bodyweight</div>
      </UCard>
      
      <UCard class="text-center hover:shadow-md transition-shadow py-2 px-3 border border-gray-200 dark:border-gray-800">
        <div class="text-3xl font-bold text-purple-600 mb-1">{{ exercises.filter(e => e.demonstrationImage).length }}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400">With demos</div>
      </UCard>
    </div>

    <!-- Exercise Table -->
    <UCard class="border border-gray-200 dark:border-gray-800">

      <div v-if="loading" class="space-y-3">
        <!-- Skeleton loader for table rows -->
        <div v-for="i in 8" :key="i" class="flex items-center space-x-4 p-4 border rounded-lg">
          <div class="w-28 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
          <div class="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <DataTable 
            :data="filteredExercises" 
            :columns="tableColumns"
            default-sort="exerciseName"
            :show-actions="false"
            class="[&_td]:py-2 [&_th]:py-3 [&_tbody_tr]:border-b [&_tbody_tr]:border-gray-200 [&_tbody_tr]:dark:border-gray-800 [&_tbody_tr]:hover:bg-gray-50 [&_tbody_tr]:hover:dark:bg-gray-800/50 [&_tbody_tr]:transition-colors"
          >
        <!-- Exercise name -->
        <template #exerciseName-cell="{ value }">
          <div class="font-medium text-gray-900 dark:text-white text-sm py-1">{{ value }}</div>
        </template>

        <!-- Muscles -->
        <template #muscle-cell="{ value }">
          <div class="text-gray-600 dark:text-gray-400 text-sm py-1">{{ value }}</div>
        </template>

        <!-- Category badge -->
        <template #category-cell="{ value }">
          <div class="py-1">
            <UBadge :color="getCategoryColor(value)" variant="soft" size="sm">
              {{ value }}
            </UBadge>
          </div>
        </template>
        
        <!-- Demo image -->
        <template #instructions-cell="{ row }">
          <img 
            :src="row.demonstrationImage || getFallbackImage()"
            :alt="`${row.exerciseName} demo`"
            class="w-28 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity hover:scale-105 transform"
            @click="openImageModal(row)"
            @error="(e) => { (e.target as HTMLImageElement).src = getFallbackImage() }"
          />
        </template>

        <!-- Equipment -->
        <template #equipment-cell="{ value }">
          <div class="text-sm text-gray-600 dark:text-gray-400 py-1">{{ value }}</div>
        </template>

        <!-- Empty state -->
        <template #empty>
          <div class="text-center py-8">
            <Icon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No exercises found</p>
          </div>
        </template>
      </DataTable>
        </div>
      </div>
    </UCard>

    <!-- Enhanced Image Modal -->
    <UModal v-model="showImageModal">
      <UCard v-if="selectedExercise" class="max-w-4xl mx-auto shadow-2xl">
        <template #header>
          <div class="flex items-center justify-between pb-2">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedExercise.exerciseName }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ selectedExercise.muscle }} • {{ selectedExercise.equipment }}
              </p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              @click="closeImageModal"
            />
          </div>
        </template>

        <div class="p-4">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Exercise Image -->
            <div class="flex-1 flex justify-center">
              <img
                :src="selectedExercise.demonstrationImage || getFallbackImage()"
                :alt="`${selectedExercise.exerciseName} demonstration`"
                class="max-w-full max-h-80 rounded-xl object-contain shadow-lg border border-gray-100 dark:border-gray-700"
              />
            </div>

            <!-- Exercise Details -->
            <div class="flex-1 space-y-4">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Type</h4>
                <UBadge
                  :color="getCategoryColor(selectedExercise.category)"
                  variant="soft"
                  size="md"
                >
                  {{ selectedExercise.category }}
                </UBadge>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Target muscles</h4>
                <p class="text-gray-600 dark:text-gray-400">{{ selectedExercise.muscle }}</p>
              </div>

              <div>
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Equipment needed</h4>
                <p class="text-gray-600 dark:text-gray-400">{{ selectedExercise.equipment }}</p>
              </div>

              <div v-if="selectedExercise.instructions">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">Instructions</h4>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {{ selectedExercise.instructions }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton
              color="neutral"
              variant="outline"
              @click="closeImageModal"
            >
              Close
            </UButton>
            <UButton
              v-if="selectedExercise.demonstrationImage"
              color="primary"
              @click="openFullSizeImage(selectedExercise.demonstrationImage)"
            >
              <Icon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 mr-2" />
              View Full Size
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>