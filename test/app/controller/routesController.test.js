const { app, assert } = require('egg-mock/bootstrap');
const { login, createUsers, createStations } = require('../../helpers');


describe('app/controller/stationsController', () => {
  let stations;
  before(async () => {
    await createUsers(app);
    stations = await createStations(app);
  });

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
      // assert.equal(body.readableAddress, 'inthemiddleofthisshithole'); // todo continue from here
      // assert.equal(body.latitude, 54.162434);
      // assert.equal(body.longitude, -56.802422);
    });
  });
  //
  // describe('GET /stations', () => {
  //   it('should get stations', async () => {
  //     const token = await login(app, 'U');
  //     const { status, body } = await app
  //       .httpRequest()
  //       .get('/stations')
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 200);
  //     assert.equal(body.entries[0]._id.toString(), createdStation._id.toString());
  //   });
  //
  //   it('should get stations', async () => {
  //     const token = await login(app, 'A');
  //     const { status, body } = await app
  //       .httpRequest()
  //       .get('/stations')
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 200);
  //     assert.equal(body.entries[0]._id.toString(), createdStation._id.toString());
  //   });
  // });
  //
  // describe('GET /stations/:id', () => {
  //   it('should get station', async () => {
  //     const token = await login(app, 'U');
  //     const { status, body } = await app
  //       .httpRequest()
  //       .get(`/stations/${createdStation._id}`)
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 200);
  //     assert.equal(body._id.toString(), createdStation._id.toString());
  //   });
  //
  //   it('should get station', async () => {
  //     const token = await login(app, 'A');
  //     const { status, body } = await app
  //       .httpRequest()
  //       .get(`/stations/${createdStation._id}`)
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 200);
  //     assert.equal(body._id.toString(), createdStation._id.toString());
  //   });
  // });
  //
  // describe('PATCH /stations/:id', () => {
  //   it('should throw unauthorized', async () => {
  //     const token = await login(app, 'U');
  //     const { status } = await app
  //       .httpRequest()
  //       .patch(`/stations/${createdStation._id}`)
  //       .set('Authorization', token)
  //       .send({
  //         readableAddress: 'inthemiddleofthisasshole',
  //       });
  //
  //     assert.equal(status, 401);
  //   });
  //
  //   it('should throw validation error', async () => {
  //     const token = await login(app, 'A');
  //     const { status } = await app
  //       .httpRequest()
  //       .patch(`/stations/${createdStation._id}`)
  //       .set('Authorization', token)
  //       .send({
  //         readableAddress: 50,
  //       });
  //
  //     assert.equal(status, 422);
  //   });
  //
  //   it('should patch station', async () => {
  //     const token = await login(app, 'A');
  //     const { status, body } = await app
  //       .httpRequest()
  //       .patch(`/stations/${createdStation._id}`)
  //       .set('Authorization', token)
  //       .send({
  //         readableAddress: 'inthemiddleofthisasshole',
  //       });
  //
  //     assert.equal(status, 200);
  //     assert.equal(body._id.toString(), createdStation._id.toString());
  //     assert.equal(body.readableAddress, 'inthemiddleofthisasshole');
  //   });
  // });
  //
  // describe('DELETE /stations/:id', () => {
  //   it('should throw unauthorized', async () => {
  //     const token = await login(app, 'U');
  //     const { status } = await app
  //       .httpRequest()
  //       .delete(`/stations/${createdStation._id}`)
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 401);
  //   });
  //
  //   it('should delete station', async () => {
  //     const token = await login(app, 'A');
  //     const { status } = await app
  //       .httpRequest()
  //       .delete(`/stations/${createdStation._id}`)
  //       .set('Authorization', token);
  //
  //     assert.equal(status, 200);
  //     const station = await app.model.Stations.findById(createdStation._id);
  //     assert(!station);
  //   });
  // });

  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
    await app.model.Routes.deleteMany({});
  });
});
