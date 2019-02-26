import actions from './actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
<%_ let filteredActions = api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload) _%>
<%_ if (filteredActions.length) { _%>
import { API_ACTION_MODULE } from '@/store/lib/mixins'
<%_ } _%>
import { COLLECTION_MODULE } from '@/store/lib/mixins'
import { PAGINATED_COLLECTION_MODULE } from '@/store/lib/mixins'
import { FORM_MODULE } from '@/store/lib/mixins'

// <%= schema.identifier %> Vuex module definition
<%_ if (!api_actions[0]) { _%>
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    form: FORM_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>', NEW_MODEL: {} }), // TODO - integrate NEW_MODEL
    collection: COLLECTION_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>' }),
    paginatedCollection: PAGINATED_COLLECTION_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>' })
  }
}
<%_ } else { _%>
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  modules: {
    form: FORM_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>', NEW_MODEL: {} }), // TODO - integrate NEW_MODEL
    collection: COLLECTION_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>' }),
    paginatedCollection: PAGINATED_COLLECTION_MODULE({ API_ROOT: '/api/<%= schema.identifier_plural %>' }),
  <%_ filteredActions.forEach((action, index) => { _%>
    <%= action.uri %>: API_ACTION_MODULE()<%= helpers.trailingComma(filteredActions, index) %>
  <%_ }) _%>
  }
}
<%_ } _%>
