const { getPaginationParams } = require('./pagination')
const assert = require('chai').assert;

// Default pagination options
// function getPaginationParams (req) {
//   let page = Number(req.query.page) || 0;
//   let per_page = Number(req.query.per_page) || 300;
//   let offset = per_page * page;
//   return { page, per_page, offset }
// }

// // // //

// non_zero_query
// Should return an offset of 20
const non_zero_query = {
  page: '2',
  per_page: '10',
}

describe('/lib/pagination.js', () => {
  describe('non-zero page parameter present', () => {
    it('verify correct offset', () => {

      let params = getPaginationParams({ query: non_zero_query })
      // Asserts equality of original payload and signed/verified payload
      assert.equal(params.offset, 20);
      assert.equal(params.page, Number(non_zero_query.page))
      assert.equal(params.per_page, Number(non_zero_query.per_page));

    });
  });
});
