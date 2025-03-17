<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFormStore } from './stores/formStore'
import UserForm from './components/UserForm.vue'
import HistoryList from './components/HistoryList.vue'
import StatusMessage from './components/StatusMessage.vue'

const store = useFormStore()

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
})

// данные из хранилища
const currentStep = computed(() => store.currentStep) 
const historyLength = computed(() => store.history.length)
const history = computed(() => store.history)
const canUndo = computed(() => store.canUndo)
const canRedo = computed(() => store.canRedo)

const statusMessage = ref('')
const statusType = ref('')

onMounted(() => {
  if (store.history.length === 0) {
    fetchInitialData()
  } else {
    syncFormDataWithStore()
    showStatus('Данные загружены из localStorage', 'success')
  }
})

function updateFormData(newData) {
  Object.assign(formData, newData)
}

// Синхронизация данных с хранилищем
function syncFormDataWithStore() {
  const currentState = store.getCurrentState()
  Object.assign(formData, currentState)
}

async function fetchInitialData() {
  try {
    await store.fetchInitialData()
    syncFormDataWithStore()
    showStatus('Данные загружены с сервера', 'success')
  } catch (error) {
    showStatus('Ошибка при загрузке данных', error)
  }
}

// Сохранение формы
async function saveForm() {
  try {
    store.saveToHistory(formData)
    await store.saveToServer(formData)
    showStatus('Данные успешно сохранены', 'success')
  } catch (error) {
    showStatus('Ошибка при сохранении данных', error)
  }
}

function clearHistory() {
  store.clearHistory({ ...formData })
  showStatus('История очищена', 'info')
}

function undo() {
  store.undo()
  syncFormDataWithStore()
  showStatus('Возврат к предыдущему состоянию', 'info')
}

function redo() {
  store.redo()
  syncFormDataWithStore()
  showStatus('Переход к следующему состоянию', 'info')
}

function showStatus(message, type) {
  statusMessage.value = message
  statusType.value = type

  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="container mx-auto p-4 max-w-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Форма пользователя</h1>

    <UserForm
      :form-data="formData"
      :current-step="currentStep"
      :history-length="historyLength"
      :can-undo="canUndo"
      :can-redo="canRedo"
      @update:form-data="updateFormData"
      @save="saveForm"
      @undo="undo"
      @redo="redo"
    />

    <HistoryList :history="history" :current-step="currentStep" @clear-history="clearHistory" />

    <StatusMessage v-if="statusMessage" :message="statusMessage" :type="statusType" />
  </div>
</template>
