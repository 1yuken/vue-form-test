const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const mockUserData = {
  firstName: 'Осман',
  lastName: 'Асанов',
  email: '123@test.ru',
}

export const apiService = {
  // Получение данных пользователя
  async fetchUserData() {
    await delay(500)

    return {
      ...mockUserData,
      timestamp: new Date(),
    }
  },

  // Сохранение данных пользователя
  async saveUserData(userData) {
    await delay(500)

    console.log('Сохранение данных:', userData)

    if (Math.random() > 0.1) {
      return { success: true }
    } else {
      throw new Error('Ошибка сервера')
    }
  },
}
