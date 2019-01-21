import axios from 'axios'
import { RESET_ROUTE } from './constants'

// Reset Token Module
const actions = {
  // resetToken
  // TODO - resetToken should be it own module?
  // Handles user.password_reset_token creation
  post ({ state, commit }) {
    commit('loading', true)

    // Sends login data to server
    axios({
      method: 'post',
      url: RESET_ROUTE,
      data: {
        email: state.email
      }
    })
    .then(() => {
      commit('done', true)
      commit('loading', false)
    })
    .catch((err) => {
      commit('loading', false)
      commit('error', err.message)
    })
  },

  // resetForm
  resetForm ({ commit }) {
    commit('email', '')
    commit('error', '')
    commit('done', false)
  }
}

const state = {
  email: '',
  loading: false,
  error: '',
  done: false
}

const getters = {
  email: state => state.email,
  loading: state => state.loading,
  error: state => state.error,
  done: state => state.done
}

const mutations = {
  email (state, email) { state.email = email },
  loading (state, loading) { state.loading = loading },
  error (state, error) { state.error = error },
  done (state, done) { state.done = done }
}

const namespaced = true

// Exports the Reset Module
export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
