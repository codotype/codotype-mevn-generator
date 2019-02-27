
// <%= schema.label %> Module State
export default {
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (rel.type === 'REF_BELONGS_TO') { _%>
  <%= rel.alias.identifier_plural %>: [],
  <%_ } else if (rel.type === 'HAS_MANY') { _%>
  <%= rel.alias.identifier_plural %>: [],
  <%_ } else if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  <%= rel.alias.identifier %>: {},
  <%_ } _%>
  <%_ })_%>
  <%_ api_actions.filter(a => a.payload).forEach((action) => { _%>
  <%= action.function_name %>Payload: {},
  <%_ }) _%>
  newModel: {},
  editModel: {}
}
