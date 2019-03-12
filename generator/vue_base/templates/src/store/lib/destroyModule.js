import axios from 'axios'

// EDIT MODULE Action Vuex Module
export const DESTROY_MODULE = ({ API_ROOT }) => {
  return Object.assign({}, {
    namespaced: true,
    state: {
      loading: false
    },
    mutations: {
      loading (state, loading) {
        state.loading = loading
      }
    },
    getters: {
      loading (state) {
        return state.loading
      }
    },
    actions: {
      destroy ({ commit, rootGetters }, modelId) {
        commit('fetching', true)
        axios.delete(`${API_ROOT}/${modelId}`, {
          headers: {
            authorization: rootGetters['auth/authorizationHeader']
          }
        })
        .then(() => {
          commit('fetching', false)
          commit('toast/add', { message: 'Deleted <%= schema.label %>', context: 'success', dismissible: true }, { root: true })
          // let collection = state.collection.filter(m => m._id !== modelId)
          // commit('collection', collection)
          // router.push(`/<%= schema.identifier_plural %>`)
        })
        .catch((err) => {
          commit('fetching', false)
          commit('toast/add', { message: 'Destroy error', context: 'danger', dismissible: true }, { root: true })
          throw err // TODO - better error handling
        })
      }
    }
  })
}
