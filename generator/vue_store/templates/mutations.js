import _ from 'lodash'
import { NEW_<%= schema.identifier.toUpperCase() %> } from './constants'
import {
} from '@/store/lib/mixins'

// <%= schema.label %> Module Mutations
export default {
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (rel.type === 'REF_BELONGS_TO') { _%>
  <%= rel.alias.identifier_plural %> (state, <%= rel.alias.identifier_plural %>) {
    state.<%= rel.alias.identifier_plural %> = <%= rel.alias.identifier_plural %>
  },
  <%_ } else if (rel.type === 'HAS_MANY') { _%>
  <%= rel.alias.identifier_plural %> (state, <%= rel.alias.identifier_plural %>) {
    state.<%= rel.alias.identifier_plural %> = <%= rel.alias.identifier_plural %>
  },
  <%_ } else if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  <%= rel.alias.identifier %> (state, <%= rel.alias.identifier %>) {
    state.<%= rel.alias.identifier %> = <%= rel.alias.identifier %>
  },
  <%_ } _%>
  <%_ })_%>
  <%_ api_actions.filter(a => a.payload).forEach((action) => { _%>
  <%= action.function_name %>Payload (state, <%= action.function_name %>Payload) {
    state.<%= action.function_name %>Payload = <%= action.function_name %>Payload
  },
  <%_ }) _%>
  resetNewModel (state) {
    state.newModel = _.cloneDeep(NEW_<%= schema.identifier.toUpperCase() %>)
  },
  editModel (state, model) {
    state.editModel = _.cloneDeep(model)
  }
}
