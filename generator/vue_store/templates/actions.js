// TODO - replace router here - instead,
// emit an event and have it handled by another Vuex module
import router from '@/routers'
import axios from 'axios'
import { API_ROOT } from './constants'

// TODO - CODOTYPE - add model option for pagination & querying
import { PAGINATION_ACTIONS, FILTER_ACTIONS } from '@/store/lib/mixins'
// TODO - CODOTYPE - add model option for pagination & querying

// // // //

export default {
  // TODO - CODOTYPE - add model option for pagination & querying
  ...PAGINATION_ACTIONS,
  ...FILTER_ACTIONS('<%= schema.identifier %>'),
  // TODO - CODOTYPE - add model option for pagination & querying
  // GET /api/<%= schema.identifier_plural %>
  fetchCollection ({ state, commit, rootGetters }) {
    commit('fetching', true)
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
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  // GET /api/<%= schema.identifier_plural %>/:id
  fetchModel ({ commit, rootGetters }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(`${API_ROOT}/${<%= schema.identifier %>Id}`, {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(({ data }) => {
      commit('model', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ schema.relations.forEach((rel, index) => { _%>
  <%_ if (rel.type === 'REF_BELONGS_TO') { _%>
  // OWNS MANY
  // GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier_plural %>
  <%= 'fetch' + rel.alias.class_name_plural %> ({ commit, rootGetters }, <%= schema.identifier %>Id) {
    commit('fetching', true)

    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier_plural %>', {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier_plural %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } else if (rel.type === 'HAS_MANY') { _%>
  <%= 'fetch' + rel.alias.class_name_plural %> ({ commit, rootGetters }, <%= schema.identifier %>Id) {
    commit('fetching', true)

    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier_plural %>', {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier_plural %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } else if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  // BELONGS TO
  // GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier %>
  <%= 'fetch' + rel.alias.class_name %> ({ commit, rootGetters }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier %>', {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } _%>
  <%_ }) _%>
  // GET /api/<%= schema.identifier_plural %>/:id
  fetchEditModel ({ commit, rootGetters }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(`${API_ROOT}/${<%= schema.identifier %>Id}`, {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(({ data }) => {
      commit('editModel', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  // POST /api/<%= schema.identifier_plural %>
  createModel ({ commit, rootGetters }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    axios.post(API_ROOT, <%= schema.identifier %>Model, {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(() => {
      commit('fetching', false)
      router.push(`/<%= schema.identifier_plural %>`)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Create error', context: 'danger', dismissible: true }, { root: true })
      throw err
    })
  },
  // PUT /api/<%= schema.identifier_plural %>/:id
  updateModel ({ commit, rootGetters }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    axios.put(`${API_ROOT}/${<%= schema.identifier %>Model._id}`, <%= schema.identifier %>Model, {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(() => {
      commit('fetching', false)
      router.back()
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Update error', context: 'danger', dismissible: true }, { root: true })
      throw err
    })
  },
  // DELETE /api/<%= schema.identifier_plural %>/:id
  deleteModel ({ state, commit, rootGetters }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    axios.delete(`${API_ROOT}/${<%= schema.identifier %>Model._id}`, {
      headers: {
        authorization: rootGetters['auth/authorizationHeader']
      }
    })
    .then(() => {
      commit('fetching', false)
      let collection = state.collection.filter(m => m._id !== <%= schema.identifier %>Model._id)
      commit('collection', collection)
      router.push(`/<%= schema.identifier_plural %>`)
    })
    .catch((err) => {
      commit('fetching', false)
      // commit('notification/add', { message: 'Destroy error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  }
}