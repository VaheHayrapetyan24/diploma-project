const { app, assert } = require('egg-mock/bootstrap');
const { login, createUsers, createStations } = require('../../helpers');


describe('app/controller/stationsController', () => {
  let stations;
  before(async () => {
    await createUsers(app);
    stations = await createStations(app);
  });

  let createdRoute;
  describe('POST /routes', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post('/routes')
        .set('Authorization', token)
        .send({ stationIds: [ stations[0]._id ] });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/routes')
        .set('Authorization', token)
        .send({ stationIds: [ 'aaa' ] });

      assert.equal(status, 422);
    });


    it('should throw 404', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/routes')
        .set('Authorization', token)
        .send({ stationIds: [ '5e3db9a33b14901924cc5c22' ] });

      assert.equal(status, 404);
    });

    it('should create', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .post('/routes')
        .set('Authorization', token)
        .send({ stationIds: [ stations[0]._id, stations[1]._id ] });

      assert.equal(status, 200);
      assert(body._id);
      assert.equal(body.stationIds.length, 2);
      createdRoute = body;
    });
  });

  describe('GET /routes', () => {
    it('should get routes', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get('/routes')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdRoute._id.toString());
    });

    it('should get routes', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get('/routes')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdRoute._id.toString());
    });
  });

  describe('GET /routes/:id', () => {
    it('should get route', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/routes/${createdRoute._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdRoute._id.toString());
    });

    it('should get route', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get(`/routes/${createdRoute._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdRoute._id.toString());
    });
  });

  describe('PATCH /routes/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .patch(`/routes/${createdRoute._id}`)
        .set('Authorization', token)
        .send({ stationIds: [ stations[0]._id, stations[0]._id, stations[2]._id ] });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/routes/${createdRoute._id}`)
        .set('Authorization', token)
        .send({ stationIds: [ 'rghth' ] });

      assert.equal(status, 422);
    });

    it('should throw 404', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/routes/${createdRoute._id}`)
        .set('Authorization', token)
        .send({ stationIds: [ '5e3db9a33b14901924cc5c22' ] });

      assert.equal(status, 404);
    });

    it('should patch route', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .patch(`/routes/${createdRoute._id}`)
        .set('Authorization', token)
        .send({ stationIds: [ stations[2]._id, stations[2]._id ] });


      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdRoute._id.toString());
      assert.equal(body.stationIds.length, 1);
    });
  });

  describe('DELETE /routes/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .delete(`/routes/${createdRoute._id}`)
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should delete route', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .delete(`/routes/${createdRoute._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      const station = await app.model.Routes.findById(createdRoute._id);
      assert(!station);
    });
  });

  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
    await app.model.Routes.deleteMany({});
  });
});
