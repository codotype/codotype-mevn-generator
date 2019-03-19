const boom = require('boom')
const { getPaginationParams } = require('../../lib/pagination')
const <%= schema.class_name %> = require('./<%= schema.identifier %>.model')
<%_ let relationImports = [] _%>
<%_ schema.relations.forEach((relation) => { _%>
<%_ if (relation.schema.class_name !== schema.class_name && !relationImports.includes(relation.schema.class_name)) { _%>
<%_ relationImports.push(relation.schema.class_name) _%>
const <%= relation.schema.class_name %> = require('../<%= relation.schema.identifier %>/<%= relation.schema.identifier %>.model')
<%_ } _%>
<%_ }) _%>

// // // //

<%_ if (schema.identifier === 'user') { _%>
<%- include('./partials/controller-user-profile.js') %>

<%_ } _%>

<%- include('./partials/controller-list.js') %>

<%- include('./partials/controller-search.js') %>

<%- include('./partials/controller-create.js') %>

<%- include('./partials/controller-show.js') %>

<%- include('./partials/controller-api-actions.js') %>

<%- include('./partials/controller-relation-actions.js') %>

<%- include('./partials/controller-update.js') %>

<%- include('./partials/controller-destroy.js') %>