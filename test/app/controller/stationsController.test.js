const { app, assert } = require('egg-mock/bootstrap');
const { login, createUsers } = require('../../helpers');


describe('app/controller/stationsController', () => {
  before(async () => {
    await createUsers(app);
  });

  let createdStation;
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
      createdStation = body;
    });
  });

  describe('GET /stations', () => {
    it('should get stations', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get('/stations')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdStation._id.toString());
    });

    it('should get stations', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get('/stations')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdStation._id.toString());
    });
  });

  describe('GET /stations/:id', () => {
    it('should get station', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/stations/${createdStation._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdStation._id.toString());
    });

    it('should get station', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get(`/stations/${createdStation._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdStation._id.toString());
    });
  });

  describe('PATCH /stations/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .patch(`/stations/${createdStation._id}`)
        .set('Authorization', token)
        .send({
          readableAddress: 'inthemiddleofthisasshole',
        });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/stations/${createdStation._id}`)
        .set('Authorization', token)
        .send({
          readableAddress: 50,
        });

      assert.equal(status, 422);
    });

    it('should patch station', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .patch(`/stations/${createdStation._id}`)
        .set('Authorization', token)
        .send({
          readableAddress: 'inthemiddleofthisasshole',
        });

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdStation._id.toString());
      assert.equal(body.readableAddress, 'inthemiddleofthisasshole');
    });
  });

  describe('DELETE /stations/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .delete(`/stations/${createdStation._id}`)
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should delete station', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .delete(`/stations/${createdStation._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      const station = await app.model.Stations.findById(createdStation._id);
      assert(!station);
    });
  });

  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
  });
});
