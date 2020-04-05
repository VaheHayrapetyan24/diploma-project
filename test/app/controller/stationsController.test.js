const { app, assert } = require('egg-mock/bootstrap');
const { login, createUsers } = require('../../helpers');


describe('app/controller/stationsController', () => {
  before(async () => {
    await createUsers(app);
  });

  describe('POST /stations', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post('/stations')
        .set('Authorization', token)
        .send({
          readableAddress: 'inthemiddleofthisshithole',
          latitude: 54.162434,
          longitude: -56.802422,
        });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/stations')
        .set('Authorization', token)
        .send({
          readableAddress: 'inthemiddleofthisshithole',
          longitude: -56.802422,
        });

      assert.equal(status, 422);
    });

    it('should create', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .post('/stations')
        .set('Authorization', token)
        .send({
          readableAddress: 'inthemiddleofthisshithole',
          latitude: 54.162434,
          longitude: -56.802422,
        });

      assert.equal(status, 200);
      assert(body._id);
      assert.equal(body.readableAddress, 'inthemiddleofthisshithole');
      assert.equal(body.latitude, 54.162434);
      assert.equal(body.longitude, -56.802422);
    });
  });


  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
  });
});
