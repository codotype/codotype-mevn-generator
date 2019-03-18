import axios from 'axios'
import router from '@/routers'
import { RESET_PASSWORD_ROUTE } from './constants'

export default {
  namespaced: true,
  state: {
    loading: '',
    password: 'reverse',
    password_verify: 'reverse',
    password_reset_token: '',
    error: '',
    done: false
  },
  getters: {
    loading: state => state.loading,
    password: state => state.password,
    password_verify: state => state.password_verify,
    verified: state => !(state.password && state.password_verify && state.password === state.password_verify),
    password_reset_token: state => state.password_reset_token,
    error: state => state.error,
    done: state => state.done
  },
  mutations: {
    loading (state, loading) { state.loading = loading },
    password (state, password) { state.password = password },
    password_verify (state, password_verify) { state.password_verify = password_verify },
    password_reset_token (state, password_reset_token) { state.password_reset_token = password_reset_token },
    error (state, error) { state.error = error },
    done (state, done) { state.done = done }
  },
  actions: {
    // post
    // Handles resetting user password
    post ({ state, commit }) {
      commit('loading', true)

      // Sends login data to server
      axios({
        method: 'post',
        url: RESET_PASSWORD_ROUTE,
        data: {
          password: state.password,
          password_reset_token: state.password_reset_token
        }
      })
      .then(() => {
        // TODO - redirect to login page
        commit('done', true)
        commit('loading', false)
        commit('password', '')
        commit('password_verify', '')
        router.push('/auth/login')
      })
      .catch((err) => {
        commit('loading', false)
        commit('error', err.message)
      })
    }
  }
}
