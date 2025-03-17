<script setup>
import DeleteIcon from './icons/DeleteIcon.vue'

defineProps({
  history: {
    type: Array,
    default: () => [],
  },
  currentStep: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['clear-history'])


function formatTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function onClearHistory() {
  emit('clear-history')
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">История изменений</h2>
      <button
        type="button"
        @click="onClearHistory"
        class="px-2 py-1.5 bg-red-100 text-red-700 rounded-md transition cursor-pointer hover:bg-red-200"
      >
        <DeleteIcon />
      </button>
    </div>
    <div class="max-h-60 overflow-y-auto">
      <div
        v-for="(entry, index) in history"
        :key="index"
        class="p-2 mb-2 border rounded"
        :class="{ 'bg-blue-50 border-blue-300': index === currentStep }"
      >
        <div class="flex justify-between">
          <span class="font-medium">Шаг {{ index + 1 }}</span>
          <span class="text-xs text-gray-500">{{ formatTime(entry.timestamp) }}</span>
        </div>
        <div class="text-sm">
          <div>Имя: {{ entry.firstName }}</div>
          <div>Фамилия: {{ entry.lastName }}</div>
          <div>Email: {{ entry.email }}</div>
        </div>
        <div v-if="index === currentStep" class="mt-1 text-xs text-blue-600">Текущий</div>
      </div>
    </div>
  </div>
</template>
