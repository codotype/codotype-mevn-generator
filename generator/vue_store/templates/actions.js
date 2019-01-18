// TODO - replace router here - instead,
// emit an event and have it handled by another Vuex module
import router from '@/routers'
import axios from 'axios'
import { API_ROOT } from './constants'
import { $POST, $PUT, $DEL } from '@/store/lib/helpers'
import { PAGINATION_ACTIONS, FILTER_ACTIONS } from '@/store/lib/mixins'

// // // //

export default {
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (rel.type === 'REF_BELONGS_TO') { _%>
  // OWNS MANY
  // GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier_plural %>
  <%= 'fetch' + rel.alias.class_name_plural %> ({ commit }, <%= schema.identifier %>Id) {
    commit('fetching', true)

    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier_plural %>', {
      // headers: {
      //   authorization: rootGetters['auth/token']
      // },
      // params: {
      //   search: state.filter,
      //   page: state.currentPage,
      //   per_page: state.pageSize
      // }
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier_plural %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } else if (rel.type === 'HAS_MANY') { _%>
  <%= 'fetch' + rel.alias.class_name_plural %> ({ commit }, <%= schema.identifier %>Id) {
    commit('fetching', true)

    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier_plural %>', {
      // headers: {
      //   authorization: rootGetters['auth/token']
      // },
      // params: {
      //   search: state.filter,
      //   page: state.currentPage,
      //   per_page: state.pageSize
      // }
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier_plural %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } else if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  // BELONGS TO
  // GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier %>
  <%= 'fetch' + rel.alias.class_name %> ({ commit }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(API_ROOT + '/' + <%= schema.identifier %>Id + '/<%= rel.alias.identifier %>', {
    })
    .then(({ data }) => {
      commit('<%= rel.alias.identifier %>', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  <%_ } _%>
  <%_ }) _%>
  ...PAGINATION_ACTIONS,
  ...FILTER_ACTIONS('<%= schema.identifier %>'),
  // GET /api/<%= schema.identifier_plural %>
  fetchCollection ({ state, commit, rootGetters }) {
    commit('fetching', true)
    let apiRoot
    if (state.filter) {
      apiRoot = API_ROOT + '/search'
    } else {
      apiRoot = API_ROOT
    }
    axios.get(apiRoot, {
      headers: {
        authorization: rootGetters['auth/token']
      },
      params: {
        search: state.filter,
        page: state.currentPage,
        per_page: state.pageSize
      }
    })
    .then(({ data }) => {
      // console.log(data)
      commit('collection', data.items)
      commit('pageSize', data.per_page)
      commit('currentPage', data.page)
      commit('count', data.count)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  // GET /api/<%= schema.identifier_plural %>/:id
  fetchModel ({ commit }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(`${API_ROOT}/${<%= schema.identifier %>Id}`, {
      // headers: {
      //   authorization: rootGetters['auth/token']
      // }
    })
    .then(({ data }) => {
      commit('model', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  // GET /api/<%= schema.identifier_plural %>/:id
  fetchEditModel ({ commit }, <%= schema.identifier %>Id) {
    commit('fetching', true)
    axios.get(`${API_ROOT}/${<%= schema.identifier %>Id}`, {
      // headers: {
      //   authorization: rootGetters['auth/token']
      // }
    })
    .then(({ data }) => {
      commit('editModel', data)
      commit('fetching', false)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Fetch error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  },
  // POST /api/<%= schema.identifier_plural %>
  createModel ({ commit }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    $POST(`${API_ROOT}`, {
      body: <%= schema.identifier %>Model
    })
    .then(() => {
      commit('fetching', false)
      router.push(`/<%= schema.identifier_plural %>`)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Create error', context: 'danger', dismissible: true }, { root: true })
      throw err
    })
  },
  // PUT /api/<%= schema.identifier_plural %>/:id
  updateModel ({ commit }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    $PUT(`${API_ROOT}/${<%= schema.identifier %>Model._id}`, {
      body: <%= schema.identifier %>Model
    })
    .then((<%= schema.identifier %>) => {
      commit('fetching', false)
      router.push(`/<%= schema.identifier_plural %>/${<%= schema.identifier %>._id}`)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Update error', context: 'danger', dismissible: true }, { root: true })
      throw err
    })
  },
  // DELETE /api/<%= schema.identifier_plural %>/:id
  deleteModel ({ state, commit }, <%= schema.identifier %>Model) {
    commit('fetching', true)
    $DEL(`${API_ROOT}/${<%= schema.identifier %>Model._id}`)
    .then(() => {
      commit('fetching', false)
      let collection = state.collection.filter((m) => { return m._id !== <%= schema.identifier %>Model._id })
      commit('collection', collection)
      router.push(`/<%= schema.identifier_plural %>`)
    })
    .catch((err) => {
      commit('fetching', false)
      commit('notification/add', { message: 'Destroy error', context: 'danger', dismissible: true }, { root: true })
      throw err // TODO - better error handling
    })
  }
}
