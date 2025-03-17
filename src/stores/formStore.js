import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { apiService } from '../services/apiService'

export const useFormStore = defineStore('form', () => {
  const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
  })

  const history = ref([])
  const currentStep = ref(-1)

  function initStore() {
    const savedState = localStorage.getItem('formState')

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)

        // Восстановление истории и текущего шага
        history.value = parsedState.history || []
        currentStep.value = parsedState.currentStep || 0

        // Восстановление текущего состояния
        if (
          history.value.length > 0 &&
          currentStep.value >= 0 &&
          currentStep.value < history.value.length
        ) {
          Object.assign(formData, history.value[currentStep.value])
        }
      } catch (error) {
        console.error('Ошибка при загрузке из localStorage:', error)
        resetState()
      }
    } else {
      resetState()
    }
  }

  function resetState() {
    Object.assign(formData, {
      firstName: '',
      lastName: '',
      email: '',
    })

    history.value = []
    currentStep.value = -1
  }

  function saveToLocalStorage() {
    try {
      localStorage.setItem(
        'formState',
        JSON.stringify({
          history: history.value,
          currentStep: currentStep.value,
        }),
      )
    } catch (error) {
      console.error('Ошибка при сохранении в localStorage:', error)
    }
  }

  function getCurrentState() {
    if (currentStep.value >= 0 && currentStep.value < history.value.length) {
      return { ...history.value[currentStep.value] }
    }
    return { firstName: '', lastName: '', email: '' }
  }

  function saveToHistory(newData) {
    const dataWithTimestamp = {
      ...newData,
      timestamp: new Date(),
    }

    // Если мы не в конце истории, обрезаем будущие состояния
    if (currentStep.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentStep.value + 1)
    }

    history.value.push(dataWithTimestamp)
    currentStep.value = history.value.length - 1

    saveToLocalStorage()
  }

  // Очистка истории
  function clearHistory(currentState = null) {
    const stateWithTimestamp = {
      ...(currentState || formData),
      timestamp: new Date(),
    }

    history.value = [stateWithTimestamp]
    currentStep.value = 0

    saveToLocalStorage()
  }

  function undo() {
    if (currentStep.value > 0) {
      currentStep.value--
      Object.assign(formData, history.value[currentStep.value])
      saveToLocalStorage()
    }
  }

  function redo() {
    if (currentStep.value < history.value.length - 1) {
      currentStep.value++
      Object.assign(formData, history.value[currentStep.value])
      saveToLocalStorage()
    }
  }

  // Загрузка начальных данных
  async function fetchInitialData() {
    try {
      const data = await apiService.fetchUserData()

      const dataWithTimestamp = {
        ...data,
        timestamp: data.timestamp || new Date(),
      }

      Object.assign(formData, dataWithTimestamp)
      history.value = [{ ...dataWithTimestamp }]
      currentStep.value = 0

      saveToLocalStorage()
      return data
    } catch (error) {
      console.error('Ошибка при загрузке начальных данных:', error)
      throw error
    }
  }

  async function saveToServer(dataToSave = null) {
    try {
      const data = dataToSave || { ...formData }
      return await apiService.saveUserData(data)
    } catch (error) {
      console.error('Ошибка при сохранении на сервер:', error)
      throw error
    }
  }

  const canUndo = computed(() => currentStep.value > 0)
  const canRedo = computed(() => currentStep.value < history.value.length - 1)

  initStore()

  return {
    formData,
    history,
    currentStep,
    getCurrentState,
    saveToHistory,
    clearHistory,
    undo,
    redo,
    fetchInitialData,
    saveToServer,
    canUndo,
    canRedo,
  }
})
