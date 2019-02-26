
// // // //
// Adds a Model definition to a Vuex module
export const MODEL_GETTERS = {
  model: state => {
    return state.model
  }
}

export const MODEL_MUTATIONS = {
  model (state, model) {
    state.model = model
  }
}

export const MODEL_STATE = {
  model: {}
}

// // // //
// // // //

// API Action Vuex Module
// TODO - annotate the purpose and usage of this mixin
// TODO - ABSTRACT ELSEWHERE??
export const API_ACTION_MODULE = () => {
  return Object.assign({}, {
    namespaced: true,
    state: {
      scope: '',
      payload: {},
      showingModal: false
    },
    getters: {
      scope: state => state.scope,
      payload: state => state.payload,
      showingModal: state => state.showingModal
    },
    mutations: {
      state (state, newState) {
        state.scope = newState.scope
        state.payload = newState.payload
        state.showingModal = newState.showingModal
      },
      scope (state, scope) {
        state.scope = scope
      },
      payload (state, payload) {
        state.payload = payload
      },
      showingModal (state, bool) {
        state.showingModal = bool
      }
    },
    actions: {}
  })
}

// // // //
// // // //
// TODO - abstract into a different file / directory

import axios from 'axios'
export const COLLECTION_MODULE = ({ API_ROOT }) => {
  return Object.assign({}, {
    namespaced: true,
    state: {
      collection: [],
      loading: false
    },
    getters: {
      collection: state => state.collection,
      loading: state => state.loading
    },
    mutations: {
      collection (state, collection) {
        state.collection = collection
      },
      loading (state, loading) {
        state.loading = loading
      }
    },
    actions: {
      fetch ({ commit, rootGetters }) {
        commit('loading', true)
        return axios.get(API_ROOT, {
          headers: {
            authorization: rootGetters['auth/authorizationHeader']
          }
        })
        .then(({ data }) => {
          commit('collection', data.items)
          commit('loading', false)
        })
        .catch((err) => {
          commit('loading', false)
          commit('toast/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
          throw err // TODO - better error handling
        })
      }
    }
  })
}

// // // //

// TODO - add filtering to this module?
// import store from '@/store'
// import debounce from 'lodash/debounce'
export const PAGINATED_COLLECTION_MODULE = ({ API_ROOT }) => {

  // function fetchCollection () {
  //   store.commit('currentPage', 0) // Sets query to search from page 0
  //   store.dispatch('fetch') // Fetches collection
  // }

  // Defines a function that sets the pagination's page to 0
  // And dispatches an api call to GET /api/module/search
  // after a 1000 delay from the last time the function was called
  // TLDR this throttles expensive search API calls
  // const debouncedFetch = debounce(fetchCollection, 1000)

  return Object.assign({}, {
    namespaced: true,
    state: {
      collection: [],
      loading: false,
      currentPage: 0,
      pageSize: 10,
      count: 0,
      filter: ''
    },
    getters: {
      collection: state => state.collection,
      loading: state => state.loading,
      currentPage: state => state.currentPage,
      pageSize: state => state.pageSize,
      count: state => state.count,
      filter: state => state.filter
    },
    mutations: {
      collection (state, collection) { state.collection = collection },
      loading (state, loading) { state.loading = loading },
      currentPage (state, page) { state.currentPage = page },
      pageSize (state, newSize) { state.pageSize = newSize },
      count (state, count) { state.count = count },
      filter (state, filter) { state.filter = filter }
    },
    actions: {
      setFilter ({ commit, dispatch }, filter) {
        commit('filter', filter)
        // debouncedFetch()
        dispatch('fetch') // TODO - how do we debounce this action?
      },
      clearFilter ({ commit, dispatch }) {
        commit('filter', '')
        // debouncedFetch()
        dispatch('fetch') // TODO - how do we debounce this action?
      },
      goToPage ({ commit, dispatch }, page) {
        commit('currentPage', page)
        dispatch('fetch')
      },
      fetch ({ state, commit, rootGetters }) {
        commit('loading', true)
        let apiRoot
        if (state.filter) {
          apiRoot = API_ROOT + '/search'
        } else {
          apiRoot = API_ROOT
        }
        return axios.get(apiRoot, {
          headers: {
            authorization: rootGetters['auth/authorizationHeader']
          },
          params: {
            search: state.filter,
            page: state.currentPage,
            per_page: state.pageSize
          }
        })
        .then(({ data }) => {
          commit('collection', data.items)
          commit('pageSize', data.per_page)
          commit('currentPage', data.page)
          commit('count', data.count)
          commit('loading', false)
        })
        .catch((err) => {
          commit('loading', false)
          commit('toast/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
          throw err // TODO - better error handling
        })
      }
    }
  })
}


