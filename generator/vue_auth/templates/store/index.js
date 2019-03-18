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

import forgotPasswordModule from './forgotPasswordModule'
import resetPasswordModule from './resetPasswordModule'

export default {
  namespaced: true,
  state: {
    token: localStorage.token || '',
    fetching: false,
    logging_in: false,
    logged_in: false,
    current_user: {},
    login_user: {
      email: 'john@doe.com',
      password: 'abc123',
      errors: {}
    },
    register_user: {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'abc123',
      passwordverify: 'abc123',
      errors: {}
    }
  },
  mutations: {
    fetching (state, isFetching) {
      state.fetching = isFetching
    },
    clear_login_user (state) {
      state.login_user = {
        email: '',
        password: '',
        errors: {}
      }
    },
    clear_register_user (state) {
      state.register_user = {
        email: '',
        password: '',
        passwordverify: '',
        errors: {}
      }
    },
    logging_in (state, status) {
      state.logging_in = status
    },
    logged_in (state, bool) {
      state.logged_in = bool
    },
    token (state, token) {
      localStorage.token = token
      state.token = token
    },
    clear_token (state) {
      localStorage.token = ''
      state.token = ''
    },
    current_user (state, currentUser) {
      state.current_user = currentUser
    },
    clear_current_user (state) {
      state.current_user = {}
    }
  },
  getters: {
    login_user: state => {
      return state.login_user
    },
    register_user: state => {
      return state.register_user
    },
    is_authenticated: state => {
      if (state.current_user && state.current_user._id) {
        return true
      } else {
        return false
      }
    },
    isAdmin: state => {
      return state.current_user.admin
    },
    current_user: state => {
      return state.current_user
    },
    logging_in: state => {
      return state.logging_in
    },
    logged_in: state => {
      return state.logged_in
    },
    token: state => {
      return state.token
    },
    authorizationHeader: state => {
      return 'JWT ' + state.token
    },
    fetching: state => {
      return state.fetching
    }
  },
  actions: {
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
        // commit('toast/add', REGISTER_SUCCESS_NOTIFICATION, { root: true })

        // Redirects to login route
        // TODO - emit event instead of routing in action
        router.push('/auth/login')
      })
      .catch((err) => {
        // Shows REGISTER_ERROR_NOTIFICATION message
        commit('logging_in', false)
        // commit('toast/add', REGISTER_ERROR_NOTIFICATION, { root: true })
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
        // commit('toast/add', LOGIN_SUCCESS_NOTIFICATION, { root: true })

        // Clears state.login_user
        commit('clear_login_user')

        // Redirects to home route
        // Router.push('/')
        commit('logged_in', true)
      })
      .catch((err) => {
        // Shows LOGIN_ERROR_NOTIFICATION message
        commit('logging_in', false)
        // commit('toast/add', LOGIN_ERROR_NOTIFICATION, { root: true })
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
  },
  modules: {
    forgot_password: forgotPasswordModule,
    reset_password: resetPasswordModule
  }
}
