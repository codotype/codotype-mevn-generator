// TODO - update user mock as needed
// TODO - user mock should encapsulate ALL attributes
const USER_MOCK = {
  email: 'john@doe.com',
  admin: true,
  role: 'ADMIN',
  password: 'securepassword'
};

const USER_MOCK_ALT = {
  email: 'jane@doe.com',
  admin: true,
  role: 'ADMIN',
  password: 'securepassword'
};

<%_ Object.keys(mocks).forEach((m) => { _%>
const <%= m %> = <%- JSON.stringify(mocks[m], null, 2) %>

<%_ }) _%>
// // // //

module.exports = {
  USER_MOCK,
  USER_MOCK_ALT,
  <%_ Object.keys(mocks).forEach((m) => { _%>
  <%= m %>,
  <%_ }) _%>
}
