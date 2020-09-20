import Cookies from 'universal-cookie'
import AuthService from '@/services/AuthService.js'
export const state = () => ({
  locales: ['en', 'es'],
  locale: 'en',
  user: null,
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  SET_USER(state, user) {
    state.user = user
  },
  REMOVE_USER(state) {
    state.user = null
  },
}

export const actions = {
  login({ commit }, user) {
    if (user) {
      commit('SET_USER', user)
    }
  },
  logout({ commit }) {
    return AuthService.logout().then(() => {
      const cookies = new Cookies()
      cookies.remove('user', { path: '/' })
      commit('REMOVE_USER')
    })
  },

  nuxtServerInit({ commit }, { req }) {
    const cookies = new Cookies(req.headers.cookie)
    const user = cookies.get('user')
    if (user) {
      commit('SET_USER', user.user)
    }
  },
}
