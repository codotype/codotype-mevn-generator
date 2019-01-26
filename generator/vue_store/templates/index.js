import actions from './actions'
import state from './state'
import getters from './getters'
import mutations from './mutations'
<%_ let filteredActions = api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload) _%>
<%_ if (filteredActions.length) { _%>
import { API_ACTION_MODULE } from '@/store/lib/mixins'
<%_ } _%>
const namespaced = true

// <%= schema.identifier %> Vuex module definition
<%_ if (!api_actions) { _%>
export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
<%_ } else { _%>
export default {
  namespaced,
  state,
  mutations,
  actions,
  getters,
  modules: {
  <%_ filteredActions.forEach((action, index) => { _%>
    <%= action.uri %>: { ...API_ACTION_MODULE() }<%= helpers.trailingComma(filteredActions, index) %>
  <%_ }) _%>
  }
}
<%_ } _%>
