<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            @click="handleSort(column.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <Icon
                v-if="column.sortable"
                :name="getSortIcon(column.key)"
                class="w-4 h-4"
              />
            </div>
          </th>
          <th v-if="showActions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-for="(row, index) in sortedData"
          :key="getRowKey(row, index)"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4"
            :class="column.class || 'whitespace-nowrap'"
          >
            <slot
              :name="`${column.key}-cell`"
              :row="row"
              :value="getValue(row, column.key)"
              :column="column"
            >
              <span class="text-sm text-gray-900 dark:text-white">
                {{ getValue(row, column.key) }}
              </span>
            </slot>
          </td>
          <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :row="row" :index="index">
              <!-- Default actions can go here -->
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Empty state -->
    <div v-if="sortedData.length === 0" class="text-center py-12">
      <slot name="empty">
        <Icon name="i-heroicons-table-cells" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No data found</h3>
        <p class="text-gray-500 dark:text-gray-400">There are no items to display</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

interface Props {
  data: T[];
  columns: TableColumn[];
  showActions?: boolean;
  defaultSort?: string;
  defaultSortDirection?: 'asc' | 'desc';
  rowKey?: string | ((row: T) => string | number);
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
  defaultSortDirection: 'asc',
  rowKey: 'id'
});

// Sorting state
const sortColumn = ref<string>(props.defaultSort || '');
const sortDirection = ref<'asc' | 'desc'>(props.defaultSortDirection);

// Computed sorted data
const sortedData = computed(() => {
  if (!sortColumn.value) return props.data;
  
  return [...props.data].sort((a, b) => {
    const aValue = getValue(a, sortColumn.value);
    const bValue = getValue(b, sortColumn.value);
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
});

// Helper functions
const getValue = (row: T, key: string): any => {
  return key.split('.').reduce((obj, k) => obj?.[k], row);
};

const getRowKey = (row: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row);
  }
  return getValue(row, props.rowKey) || index;
};

const handleSort = (columnKey: string) => {
  const column = props.columns.find(col => col.key === columnKey);
  if (!column?.sortable) return;
  
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = columnKey;
    sortDirection.value = 'asc';
  }
};

const getSortIcon = (columnKey: string) => {
  if (sortColumn.value !== columnKey) {
    return 'i-heroicons-arrows-up-down';
  }
  return sortDirection.value === 'asc' 
    ? 'i-heroicons-chevron-up' 
    : 'i-heroicons-chevron-down';
};
</script>
