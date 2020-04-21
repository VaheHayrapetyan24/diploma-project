const { app, assert } = require('egg-mock/bootstrap');
const _ = require('lodash');
const moment = require('moment');
const {
  login,
  createUsers,
  createStations,
  createRoutes,
  createBuses,
} = require('../../helpers');


describe('app/controller/tripsController', () => {
  let stations;
  let stationIds;
  let route;
  let bus;
  before(async () => {
    await createUsers(app);
    stations = await createStations(app);
    stationIds = _.map(stations, '_id');
    route = (await createRoutes(app, stationIds))[0];
    bus = (await createBuses(app))[0];
  });

  let createdTrip;
  describe('POST /trips', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post('/trips')
        .set('Authorization', token)
        .send({
          routeId: route._id,
          busId: bus._id,
          dateTime: '2020-10-10 10:10:10',
        });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/trips')
        .set('Authorization', token)
        .send({
          routeId: route._id,
          busId: bus._id,
        });

      assert.equal(status, 422);
    });


    it('should throw 404', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/trips')
        .set('Authorization', token)
        .send({
          routeId: '5e3db9a33b14901924cc5c22',
          busId: bus._id,
          dateTime: '2020-10-10 10:10:10',
        });

      assert.equal(status, 404);
    });

    it('should create', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .post('/trips')
        .set('Authorization', token)
        .send({
          routeId: route._id,
          busId: bus._id,
          dateTime: '2020-10-10 10:10:10',
        });

      assert.equal(status, 200);
      assert(body._id);
      assert.equal(body.routeId.toString(), route._id.toString());
      assert.equal(body.busId.toString(), bus._id.toString());
      createdTrip = body;
    });
  });

  describe('GET /trips', () => {
    it('should get trips', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get('/trips')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdTrip._id.toString());
    });

    it('should get trips', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get('/trips')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdTrip._id.toString());
    });
  });

  describe('GET /trips/:id', () => {
    it('should get trip', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/trips/${createdTrip._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdTrip._id.toString());
    });

    it('should get trip', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get(`/trips/${createdTrip._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdTrip._id.toString());
    });
  });

  describe('PATCH /trips/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .patch(`/trips/${createdTrip._id}`)
        .set('Authorization', token)
        .send({
          routeId: route._id,
          busId: bus._id,
          dateTime: '2020-10-20 10:10:10',
        });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/trips/${createdTrip._id}`)
        .set('Authorization', token)
        .send({
          dateTime: '2020-10-',
        });

      assert.equal(status, 422);
    });

    it('should throw 404', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/trips/${createdTrip._id}`)
        .set('Authorization', token)
        .send({
          routeId: '5e3db9a33b14901924cc5c22',
          busId: bus._id,
          dateTime: '2020-10-10 10:10:10',
        });

      assert.equal(status, 404);
    });

    it('should patch trip', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .patch(`/trips/${createdTrip._id}`)
        .set('Authorization', token)
        .send({
          dateTime: '2020-10-10 10:10:20',
        });


      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdTrip._id.toString());
      assert(moment('2020-10-10 10:10:20', 'YYYY-MM-DD HH:MM:SS').isSame(body.dateTime));
    });
  });

  describe('DELETE /trips/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .delete(`/trips/${createdTrip._id}`)
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should delete trip', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .delete(`/trips/${createdTrip._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      const trip = await app.model.Trips.findById(createdTrip._id);
      assert(!trip);
    });
  });

  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
    await app.model.Routes.deleteMany({});
    await app.model.Trips.deleteMany({});
    await app.model.Buses.deleteMany({});
  });
});
