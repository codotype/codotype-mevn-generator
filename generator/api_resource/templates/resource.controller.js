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
<%_ if (generate_api_doc) { _%>
/**
* @api {get} /api/<%= schema.identifier_plural %> Profile
* @APIname Profile
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets profile of the current <%= schema.label %>
* @apiSuccess {json} User's profile
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %> Profile
<%_ } _%>
exports.profile = async (req, res) => {
  const user = await <%= schema.class_name %>.findOne({ email: req.user.email }, '-__v').exec()
  if (user) { return res.json(user) }
  return res.status(401).json({ message: 'No user found' })
}
<%_ } _%>

<%_ if (generate_api_doc) { _%>
/**
* @api {get} /api/<%= schema.identifier_plural %> Index
* @APIname Index
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets list of current <%= schema.label_plural %>
* @apiSuccess {json} Collection of <%= schema.label_plural %>
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/:id Index
<%_ } _%>
module.exports.list = async (req, res, next) => {
  // Gets pagination variables for query
  const { page, per_page, offset } = getPaginationParams(req);
  const count = await <%= schema.class_name %>.countDocuments({})

  // NOTES - remove
  // .find({ user_id: req.user.id })
  try {
    const <%= schema.identifier_plural %> = await <%= schema.class_name %>.find({})
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } _%>
    <%_ }) _%>
    .limit(per_page)
    .skip(offset)
    .lean()
    .exec()

    return res
    .status(200)
    .json({
      page: page,
      per_page: per_page,
      items: <%= schema.identifier_plural %>,
      count: count
    });
  } catch (err) {
    return next(boom.badImplementation(err));
  }
};


<%_ if (generate_api_doc) { _%>
/**
* @api {get} /api/<%= schema.identifier_plural %>/search Search
* @apiName search
* @apiGroup <%= schema.class_name %> Controller
* @apiDescription Gets a list of <%= schema.label_plural %> that match a search query
* @apiPermission authenticated
* @apiSuccess {Collection} root Collection of <%= schema.label %> records
* @apiError (500) UnknownException Could not retrieve <%= schema.label %> collection
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/search Search
<%_ } _%>
module.exports.search = async (req, res) => {

  // Assigns query for search
  // let query = req.query.search || ''

  // Ensures correct type casting for query
  // if (query.year) {
  //   query.year['$in'] = _.map(query.year['$in'], (yr) => { return Number(yr) })
  // }

  <%_ if (schema.attributes.filter(attr => attr.datatype === 'TEXT').length) { _%>

  let textSearch = req.query.search || ''

  const matchQuery = [
    <%_ schema.attributes.forEach((attr) => { _%>
    <%_ if (attr.datatype !== 'TEXT') { return } _%>
    { <%= attr.identifier _%>: new RegExp(textSearch, 'i') },
    <%_ }) _%>
  ]

  // Assigns matchQuery to queryObject
  // query = {}
  // query['$and'] = [
  //     { '$or': matchQuery }
  // ]

  const query = { '$or': matchQuery }
  <%_ } else { _%>
  const query = {}
  <%_ } _%>

  // Gets pagination variables for query
  const { page, per_page, offset } = getPaginationParams(req);
  const count = await <%= schema.class_name %>.countDocuments(query)

  try {
    const <%= schema.identifier_plural %> = await <%= schema.class_name %>.find(query)
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } _%>
    <%_ }) _%>
    .limit(per_page)
    .skip(offset)
    .lean()
    .exec()

    return res
    .status(200)
    .json({
      page: page,
      per_page: per_page,
      items: <%= schema.identifier_plural %>,
      count: count
    });
  } catch (err) {
    return next(boom.badImplementation(err));
  }
};


<%_ if (generate_api_doc) { _%>
/**
* @api {POST} /api/<%= schema.identifier_plural %> Create
* @APIname Create
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Creates a new <%= schema.label %>
* @apiSuccess {json} The newly created <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// POST /api/<%= schema.identifier_plural %>/:id Create
<%_ } _%>
module.exports.create = async (req, res, next) => {
  <%_ if (schema.identifier !== 'user') { _%>
  const { <%= schema.attributes.map(attr => attr.identifier).join(', ') %> } = req.body

  try {
    const newModel = await new <%= schema.class_name %>({
      ...req.body,
      // user_id: req.user.id,
      <%= schema.attributes.map(attr => attr.identifier).join(',\n      ') %>
    })
    .save()

    return res
    .status(200)
    .send(newModel)
    .end();
  } catch (err) {
    return next(boom.badImplementation(err));
  }
  <%_ } else { _%>
    // Pulls parameters from req.body
    const { <%= inlineDeconstrction %> } = req.body

    // Create a new User instance if one does not exist
    const create = (user) => {
        // User exists - throw error and return
        if (user) {
            throw new Error('User exists')
            return
        }

        // Defines a default password
        const password = Math.random.toString()

        // Creates a new User
        const newUser = new User({ <%= inlineDeconstrction %>, password })
        // newUser.role = ''
        return newUser.save()
    }

    // Respond to the client
    const respond = (user) => {
        res.json({
            message: 'Registered Successfully.'
        })
    }

    // Handle error (email exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check email duplication
    User.findOneByEmail(email)
    .then(create)
    .then(respond)
    .catch(onError)
  <%_ } _%>
};

<%_ if (generate_api_doc) { _%>
/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id Show
* @APIname Show
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Fetch a single <%= schema.label %>
* @apiSuccess {json} The requested <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/:id Show
<%_ } _%>
module.exports.show = async (req, res, next) => {
  const model = await <%= schema.class_name %>.findById(req.params.id)
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
  // .populate({ path: '<%= rel.alias.identifier_plural %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } _%>
  <%_ }) _%>
  .catch( err => next(boom.badImplementation(err)));

  return res
  .status(200)
  .send(model)
  // .send(model.toJSON({ getters: true, virtuals: true }))
  .end();
};


<%_ schemaApiActions.forEach((action) => { _%>
<%_ if (action.scope === 'ROOT' && generate_api_doc) { _%>
/**
* @api {<%= action.verb %>} /api/<%= schema.identifier_plural %>/<%= action.uri %> <%= action.label %>
* @APIname <%= action.label %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Executes the <%= action.label %> API Action
* @apiSuccess {json} The result of the <%= action.label %> API Action
* @apiError (Error) 500 Internal server error
*/
<%_ } else if (action.scope === 'MODEL' && generate_api_doc) { _%>
/**
* @api {<%= action.verb %>} /api/<%= schema.identifier_plural %>/:id/<%= action.uri %> :id/<%= action.label %>
* @APIname <%= action.label %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Executes the <%= action.label %> API Action
* @apiSuccess {json} The result of the <%= action.label %> API Action
* @apiError (Error) 500 Internal server error
*/
<%_ } else if (action.scope === 'ROOT') { _%>
// <%= action.verb %> /api/<%= schema.identifier_plural %>/<%= action.uri %> <%= action.label %>
<%_ } else if (action.scope === 'MODEL') { _%>
// <%= action.verb %> /api/<%= schema.identifier_plural %>/:id/<%= action.uri %> <%= action.label %>
<%_ } _%>
<%_ if (action.scope === 'ROOT') { _%>
module.exports.<%= action.function_name %> = async (req, res, next) => {

  // Gets pagination variables for query
  const { page, per_page, offset } = getPaginationParams(req);

  // NOTES - remove
  // .find({ user_id: req.user.id })
  const items = await <%= schema.class_name %>
  .find({})
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } _%>
  <%_ }) _%>
  .limit(per_page)
  .skip(offset)
  .lean()
  .exec()
  .catch( err => next(boom.badImplementation(err)));

  return res
  .status(200)
  .json({ page, per_page, items });
};

<%_ } else if (action.scope === 'MODEL') { _%>
module.exports.<%= action.function_name %> = async (req, res, next) => {

  //   user_id: req.user.id,
  const payload = {  } // TODO - add attributes here that you would like to change
  const model = await  <%= schema.class_name %>.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true })
  <%_ schema.relations.forEach((rel) => { _%>
  <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
  // .populate({ path: '<%= rel.alias.identifier_plural %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } _%>
  <%_ }) _%>
  .catch( err => next(boom.badImplementation(err)));

  return res
  .status(200)
  .send(model)
  // .send(response.toJSON({ getters: true, virtuals: true }))
  .end();
};

<%_ } _%>
<%_ }) _%>

<%_ schema.relations.forEach((rel) => { _%>
<%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
<%_ if (generate_api_doc) { _%>
/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier %> show<%= rel.alias.class_name %>
* @APIname show<%= rel.alias.class_name %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.alias.label %>
* @apiSuccess {json} The related <%= rel.schema.label %> model
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier %> show<%= rel.alias.class_name %>
<%_ } _%>
module.exports.show<%= rel.alias.class_name %> = async (req, res, next) => {
  const <%= schema.identifier %> = await <%= schema.class_name %>.findById(req.params.id)
  .catch( err => next(boom.badImplementation(err)));

  const <%= rel.schema.identifier %> = await <%= rel.schema.class_name %>.findById(<%= schema.identifier %>.<%= rel.alias.identifier + '_id' %>)
  <%_ let relatedSchema = blueprint.schemas.find(s => s.id === rel.related_schema_id) _%>
  <%_ relatedSchema.relations.forEach((rel) => { _%>
  <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } _%>
  <%_ }) _%>
  .catch( err => next(boom.badImplementation(err)));

  return res
  .status(200)
  .send(<%= rel.schema.identifier %>)
  .end();

};

<% } else if (rel.type === 'HAS_MANY') { %>
<%_ if (generate_api_doc) { _%>
/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier_plural %> show<%= rel.schema.class_name_plural %>
* @APIname show<%= rel.schema.class_name_plural %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.schema.class_name_plural %>
* @apiSuccess {json} The related <%= rel.schema.class_name_plural %>
* @apiError (Error) 500 Internal server error
*/
// TODO - this must be refactored to do: RelatedModel.find({ _id: [1,2,3] })
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier_plural %> show<%= rel.schema.class_name_plural %>
<%_ } _%>
module.exports.show<%= rel.alias.class_name_plural %> = async (req, res, next) => {

  const model = await <%= schema.class_name %>.findById(req.params.id)
  .catch( err => next(boom.badImplementation(err)));

  const <%= rel.schema.identifier_plural %> = await <%= rel.schema.class_name %>
  .find({ _id: model.<%= rel.alias.identifier %>_ids })
  <%_ let relatedSchema = blueprint.schemas.find(s => rel.related_schema_id) _%>
  <%_ relatedSchema.relations.forEach((rel) => { _%>
  <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
  .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
  <%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
  // .populate({ path: '<%= rel.alias.identifier_plural %>', select: '<%= rel.related_lead_attribute %>' }) // CODOTYPE-NOTE - OPTIONAL
  <%_ } _%>
  <%_ }) _%>
  .catch( err => next(boom.badImplementation(err)));

  return res
  .status(200)
  .send(<%= rel.schema.identifier_plural %>)
  .end();

};

<%_ } else if (rel.type === 'REF_BELONGS_TO') { _%>
<%_ if (generate_api_doc) { _%>
/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier_plural %> show<%= rel.alias.class_name_plural %>
* @APIname show<%= rel.alias.class_name_plural %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.alias.class_name_plural %>
* @apiSuccess {json} The related <%= rel.schema.class_name_plural %> models
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// GET /api/<%= schema.identifier_plural %>/:id/<%= rel.alias.identifier_plural %> show<%= rel.alias.class_name_plural %>
<%_ } _%>
module.exports.show<%= rel.alias.class_name_plural %> = (req, res, next) => {
    return <%= rel.schema.class_name %>
    .find({ <%= rel.reverse_alias.identifier %>_id: req.params.id })
    <%_ let relatedSchema = blueprint.schemas.find(s => s.id === rel.related_schema_id) _%>
    <%_ relatedSchema.relations.forEach((rel) => { _%>
    <%_ if (['BELONGS_TO', 'HAS_ONE'].includes(rel.type)) { _%>
    .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } _%>
    <%_ }) _%>
    .then((<%= rel.schema.identifier_plural %>) => {
        return res
        .status(200)
        .send(<%= rel.schema.identifier_plural %>)
        .end();
    })
    .catch( err => next(boom.badImplementation(err)));
};
<%_ } _%>
<%_ }) _%>

<%_ if (generate_api_doc) { _%>
/**
* @api {PUT} /api/<%= schema.identifier_plural %>/:id Update
* @APIname Update
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Update a single <%= schema.label %>
* @apiSuccess {json} The updated <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// PUT /api/<%= schema.identifier_plural %>/:id Update
<%_ } _%>
module.exports.update = (req, res, next) => {

  const { <%= schema.attributes.map(attr => attr.identifier).join(', ') %> } = req.body

  return <%= schema.class_name %>.findByIdAndUpdate(req.params.id, { $set: {
    ...req.body,
    <%= schema.attributes.map(attr => attr.identifier).join(',\n    ') %>
  }}, { new: true })
  .then((response) => {
    return res
    .status(200)
    .send(response)
    .end();
  })
  .catch( err => next(boom.badImplementation(err)));
};

<%_ if (generate_api_doc) { _%>
/**
* @api {DELETE} /api/<%= schema.identifier_plural %>/:id Destroy
* @APIname Destroy
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Destroy a single <%= schema.label %>
* @apiSuccess {json} The destroyed <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
<%_ } else { _%>
// DELETE /api/<%= schema.identifier_plural %>/:id Destroy
<%_ } _%>
module.exports.delete = (req, res, next) => {
    return <%= schema.class_name %>.remove({ _id: req.params.id })
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch( err => next(boom.badImplementation(err)));
};
