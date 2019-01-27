import axios from 'axios'
import router from '@/routers'
import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  PROFILE_ROUTE,
  LOGIN_SUCCESS_NOTIFICATION,
  LOGIN_ERROR_NOTIFICATION,
  REGISTER_SUCCESS_NOTIFICATION,
  REGISTER_ERROR_NOTIFICATION
} from './constants'

// Auth module actions
const actions = {
  // fetchUserProfile
  // Fetches a user's profiles form the server
  fetchUserProfile ({ getters, commit }) {
    return new Promise((resolve, reject) => {
      // Prevents unnecssary fetch on client start
      if (!getters['token']) {
        commit('clear_token')
        commit('clear_current_user')
        commit('logging_in', false)
        return resolve()
      }

      commit('logging_in', true)

      axios.get(PROFILE_ROUTE, {
        headers: {
          authorization: getters['authorizationHeader']
        }
      })
      .then(({ data }) => {
        commit('current_user', data)
        commit('logging_in', false)
        return resolve(data)
      })
      .catch((err) => {
        commit('clear_token')
        commit('clear_current_user')
        commit('logging_in', false)
        // throw err
        return reject(err)
      })
    })
  },

  // register
  // Handles user registration state management
  register ({ state, commit }) {
    commit('logging_in', true)

    // Assembles request payload
    let { <%= inlineDeconstrction %>, password } = state.register_user

    // Sends login data to server
    axios({
      method: 'post',
      url: REGISTER_ROUTE,
      data: { <%= inlineDeconstrction %>, password }
    })
    .then(() => {
      commit('clear_register_user')
      commit('logging_in', false)

      // Shows REGISTER_SUCCESS_NOTIFICATION message
      commit('toast/add', REGISTER_SUCCESS_NOTIFICATION, { root: true })

      // Redirects to login route
      // TODO - emit event instead of routing in action
      router.push('/auth/login')
    })
    .catch((err) => {
      // Shows REGISTER_ERROR_NOTIFICATION message
      commit('logging_in', false)
      commit('toast/add', REGISTER_ERROR_NOTIFICATION, { root: true })
      throw err
    })
  },

  // login
  // Handles user login state management
  login ({ commit, state }) {
    commit('logging_in', true)

    // Authenticates with server
    axios({
      method: 'post',
      url: LOGIN_ROUTE,
      data: {
        email: state.login_user.email,
        password: state.login_user.password
      }
    })
    .then(({ data }) => {
      // Changes loading state
      commit('logging_in', false)

      // Updates store.token
      commit('token', data.token)

      // Pulls current user data from server response
      const { email, admin, _id, role } = data
      commit('current_user', { email, admin, _id, role })

      // Shows LOGIN_SUCCESS_NOTIFICATION message
      commit('toast/add', LOGIN_SUCCESS_NOTIFICATION, { root: true })

      // Clears state.login_user
      commit('clear_login_user')

      // Redirects to home route
      // Router.push('/')
      commit('logged_in', true)
    })
    .catch((err) => {
      // Shows LOGIN_ERROR_NOTIFICATION message
      commit('logging_in', false)
      commit('toast/add', LOGIN_ERROR_NOTIFICATION, { root: true })
      throw err
    })
  },

  // logout
  // Handles user logout
  logout ({ commit }) {
    commit('clear_token')
    commit('clear_current_user')
    commit('logged_in', false)
    // Router.push('/auth/login')
  }
}

// // // //

export default actions
