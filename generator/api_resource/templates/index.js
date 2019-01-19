const router = require('express').Router();
const controller = require('./<%= schema.identifier %>.controller');
<%_ if (schema.identifier === 'user') { _%>
const authorization = require('../middleware/authorization')
<%_ } _%>

// // // //

// GET /<%= schema.identifier_plural %>
router.get('/', controller.list);

// GET /<%= schema.identifier_plural %>/search
router.get('/search', controller.search);

// POST /<%= schema.identifier_plural %>
router.post('/', controller.create);
<%_ if (schema.identifier === 'user') { _%>

// GET /<%= schema.identifier_plural %>/profile
router.get('/profile', authorization, controller.profile)
<%_ } _%>

<%_ schemaApiActions.forEach((action) => { _%>
<%_ if (action.scope === 'ROOT' && action.verb === 'GET') { _%>
// GET /<%= schema.identifier_plural %>/<%= action.uri %>
router.get('/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } else if (action.scope === 'ROOT' && action.verb === 'POST') { _%>
// POST /<%= schema.identifier_plural %>/<%= action.uri %>
router.post('/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } else if (action.scope === 'ROOT' && action.verb === 'PUT') { _%>
// PUT /<%= schema.identifier_plural %>/<%= action.uri %>
router.put('/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } else if (action.scope === 'MODEL' && action.verb === 'GET') { _%>
// GET /<%= schema.identifier_plural %>/:id/<%= action.uri %>
router.get('/:id/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } else if (action.scope === 'MODEL' && action.verb === 'POST') { _%>
// POST /<%= schema.identifier_plural %>/:id/<%= action.uri %>
router.post('/:id/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } else if (action.scope === 'MODEL' && action.verb === 'PUT') { _%>
// PUT /<%= schema.identifier_plural %>/:id/<%= action.uri %>
router.put('/:id/<%= action.uri %>', controller.<%= action.function_name %>);
<%_ } _%>
<%_ }) _%>

// GET /<%= schema.identifier_plural %>/:id
router.get('/:id', controller.show);

// PUT /<%= schema.identifier_plural %>/:id
router.put('/:id', controller.update);

// DELETE /<%= schema.identifier_plural %>/:id
router.delete('/:id', controller.delete);
<%_ /* Iterate over each schema */ _%>
<%_ schema.relations.forEach((each) => { _%>
<%_ if (['BELONGS_TO', 'HAS_ONE'].includes(each.type)) { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.alias.identifier %>
router.get('/:id/<%= each.alias.identifier %>', controller.show<%= each.alias.class_name %>);
<%_ _%>
<%_ _%>
<%_ } else if (each.type === 'HAS_MANY') { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.alias.identifier_plural %>
router.get('/:id/<%= each.alias.identifier_plural %>', controller.show<%= each.alias.class_name_plural %>);
<%_ _%>
<%_ _%>
<%_ } else if (each.type === 'REF_BELONGS_TO') { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.alias.identifier_plural %>
router.get('/:id/<%= each.alias.identifier_plural %>', controller.show<%= each.alias.class_name_plural %>);
<%_ } _%>
<%_ }) _%>

// // // //

module.exports = router;
