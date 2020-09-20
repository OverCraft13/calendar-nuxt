import FoodService from '@/services/FoodService.js'

export const state = () => ({
  foods: [],
  food: {},
  totalCount: 0,
})

export const mutations = {
  SET_FOODS(state, foods) {
    if (foods) {
      state.foods = foods
    }
  },
  SET_FOOD(state, food) {
    if (food) {
      state.food = food
    }
  },
  SET_TOTAL_COUNT(state, total) {
    if (total) {
      state.totalCount = total
    }
  },
}

export const actions = {
  fetchFoods({ commit }, { from, limit, foodGroup, name }) {
    return FoodService.index(from, limit, foodGroup, name)
      .then((response) => {
        commit('SET_FOODS', response.data.foods)
        commit('SET_TOTAL_COUNT', response.data.totalCount)
      })
      .catch((error) => {
        throw error
      })
  },
  fetchFood({ commit }, id) {
    return FoodService.show(id)
      .then((response) => {
        commit('SET_FOOD', response.data.food)
      })
      .catch((err) => {
        throw err
      })
  },
}
