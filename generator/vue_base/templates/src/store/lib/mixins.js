
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

export const PAGINATED_COLLECTION_MODULE = ({ API_ROOT }) => {
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
        commit('currentPage', 0)
        dispatch('fetch')
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


// FORM MODULE Action Vuex Module
export const FORM_MODULE = ({ API_ROOT, NEW_MODEL }) => {
  return Object.assign({}, {
    namespaced: true,
    state: {
      defaultModel: Object.assign({}, NEW_MODEL),
      model: Object.assign({}, NEW_MODEL),
      errors: [],
      loading: false
    },
    mutations: {
      defaultModel (state, defaultModel) {
        state.defaultModel = Object.assign({}, defaultModel)
      },
      reset (state) {
        state.model = Object.assign({}, state.defaultModel)
        state.errors = []
      },
      modelAttr (state, { attribute, value }) {
        state.model[attribute.identifier] = value
      },
      model (state, model) {
        state.model = Object.assign({}, model)
      },
      loading (state, loading) {
        state.loading = loading
      }
    },
    getters: {
      model (state) {
        return state.model
      },
      errors (state) {
        return state.errors
      },
      loading (state) {
        return state.loading
      },
      modelAttr: state => ({ attribute }) => {
        return state.model[attribute.identifier]
      }
    },
    actions: {
      persist ({ state, dispatch }) {
        if (!state.model._id) {
          dispatch('createModel')
        } else {
          dispatch('updateModel')
        }
      },
      createModel ({ state, commit, rootGetters }) {
        commit('loading', true)
        axios.post(API_ROOT, state.model, {
          headers: {
            authorization: rootGetters['auth/authorizationHeader']
          }
        })
        .then(() => {
          commit('loading', false)
          commit('toast/add', { message: 'Created <%= schema.label %>', context: 'success', dismissible: true }, { root: true })
          // router.push(`/<%= schema.identifier_plural %>`)
        })
        .catch((err) => {
          commit('loading', false)
          commit('toast/add', { message: 'Create error', context: 'danger', dismissible: true }, { root: true })
          throw err
        })
      },
      updateModel ({ state, commit, rootGetters }) {
        commit('loading', true)
        axios.put(`${API_ROOT}/${state.model._id}`, state.model, {
          headers: {
            authorization: rootGetters['auth/authorizationHeader']
          }
        })
        .then(() => {
          commit('loading', false)
          commit('toast/add', { message: 'Updated successfully', context: 'success', dismissible: true }, { root: true })
          // router.back()
        })
        .catch((err) => {
          commit('loading', false)
          commit('toast/add', { message: 'Update error', context: 'danger', dismissible: true }, { root: true })
          throw err
        })
      },
    }
  })
}
