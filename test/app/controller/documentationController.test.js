const { app, assert } = require('egg-mock/bootstrap');

describe('app/controller/documentationController', () => {
  describe('GET /public/documentation', () => {
    it('should respond with ok', async () => {
      const { status, body } = await app
        .httpRequest()
        .get('/public/documentation');

      assert.equal(status, 200);
      assert(body);
    });
  });
});
