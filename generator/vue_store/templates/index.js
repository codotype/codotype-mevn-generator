// import actions from './actions'
// import state from './state'
// import getters from './getters'
// import mutations from './mutations'
<%_ let filteredActions = api_actions.filter(a => ['POST', 'PUT'].includes(a.verb) && a.payload) _%>
<%_ if (filteredActions.length) { _%>
import { API_ACTION_MODULE } from '@/store/lib/mixins'
<%_ } _%>

// TODO - split these up into smaller modules in @/store/lib/modules
import { API_ROOT } from './constants'
import { COLLECTION_MODULE } from '@/store/lib/mixins'
import { LIST_MODULE } from '@/store/lib/mixins'
import { NEW_MODULE } from '@/store/lib/mixins'
import { SHOW_MODULE } from '@/store/lib/mixins'
import { EDIT_MODULE } from '@/store/lib/mixins'
import { DESTROY_MODULE } from '@/store/lib/mixins'
import { FORM_MODULE } from '@/store/lib/mixins' // TODO - retire this?

// <%= schema.label %> Vuex module definition
export default {
  namespaced: true,
  // state,
  // mutations,
  // actions,
  // getters,
  modules: {
    list: LIST_MODULE({ API_ROOT }),
    new: NEW_MODULE({ API_ROOT }),
    show: SHOW_MODULE({ API_ROOT }),
    edit: EDIT_MODULE({ API_ROOT }),
    destroy: DESTROY_MODULE({ API_ROOT }),
    form: FORM_MODULE({ API_ROOT, NEW_MODEL: {} }), // TODO - integrate NEW_MODEL
    collection: COLLECTION_MODULE({ API_ROOT }),
    <%_ filteredActions.forEach((action, index) => { _%>
      <%= action.uri %>: API_ACTION_MODULE()<%= helpers.trailingComma(filteredActions, index) %>
    <%_ }) _%>
  }
}
