<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  currentStep: {
    type: Number,
    default: 0,
  },
  historyLength: {
    type: Number,
    default: 0,
  },
  canUndo: {
    type: Boolean,
    default: false,
  },
  canRedo: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:form-data', 'save', 'undo', 'redo', 'clear-history'])

const localFormData = reactive({
  firstName: props.formData.firstName || '',
  lastName: props.formData.lastName || '',
  email: props.formData.email || '',
})

// Отслеживание изменений входных данных
watch(
  () => props.formData,
  (newValue) => {
    Object.assign(localFormData, newValue)
  },
  { deep: true },
)

// Отслеживание изменений локальных данных
watch(
  localFormData,
  (newValue) => {
    emit('update:form-data', { ...newValue })
  },
  { deep: true },
)

// Обработчики событий
function onSave() {
  emit('save')
}

function onUndo() {
  emit('undo')
}

function onRedo() {
  emit('redo')
}
</script>

<template>
  <form @submit.prevent="onSave" class="bg-white p-6 rounded-lg shadow-md mb-6">
    <div class="mb-4">
      <label for="firstName" class="block text-sm font-medium mb-1">Имя</label>
      <input
        id="firstName"
        v-model="localFormData.firstName"
        type="text"
        class="w-full px-3 py-2 border rounded-md"
      />
    </div>

    <div class="mb-4">
      <label for="lastName" class="block text-sm font-medium mb-1">Фамилия</label>
      <input
        id="lastName"
        v-model="localFormData.lastName"
        type="text"
        class="w-full px-3 py-2 border rounded-md"
      />
    </div>

    <div class="mb-6">
      <label for="email" class="block text-sm font-medium mb-1">Email</label>
      <input
        id="email"
        v-model="localFormData.email"
        type="email"
        class="w-full px-3 py-2 border rounded-md"
      />
    </div>

    <div class="flex justify-between mb-4">
      <button
        type="button"
        @click="onUndo"
        class="px-3 py-1 bg-gray-200 rounded-md transition cursor-pointer hover:bg-gray-300 disabled:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canUndo"
      >
        Отменить
      </button>

      <span class="text-sm"> Шаг {{ currentStep + 1 }} из {{ historyLength }} </span>

      <button
        type="button"
        @click="onRedo"
        class="px-3 py-1 bg-gray-200 rounded-md transition cursor-pointer hover:bg-gray-300 disabled:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canRedo"
      >
        Повторить
      </button>
    </div>

    <div class="flex space-x-2">
      <button
        type="submit"
        class="flex-1 bg-blue-500 text-white py-2 cursor-pointer transition rounded-md hover:bg-blue-600"
      >
        Сохранить
      </button>
    </div>
  </form>
</template>
