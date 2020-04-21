const { assert } = require('egg-mock/bootstrap');
const { mongodbId, password } = require('../../../app/validation/customValidators');

describe('app/validation/customValidators', () => {
  describe('mongodbId()', () => {
    it('should return nothing', () => {
      const result = mongodbId({}, '5d5d49ecf34c11ba5db676da');
      assert(!result);
    });
    it('should return error message', () => {
      const result = mongodbId({}, '5d5d49ecf34c11ba5db676dz');
      assert(result);
    });
    it('should return error message', () => {
      const result = mongodbId({}, 0);
      assert(result);
    });
  });
  describe('password()', () => {
    it('should return nothing', () => {
      const result = password({}, 'aaAaAaAa12$');
      assert(!result);
    });
    it('should return error message', () => {
      const result = password({}, 'aaaa');
      assert(result);
    });
  });
});
