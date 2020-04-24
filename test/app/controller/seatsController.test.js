const { app, assert } = require('egg-mock/bootstrap');
const _ = require('lodash');
const {
  login,
  createUsers,
  createStations,
  createBuses,
  createRoutes,
  createTrips,
  createSeats,
} = require('../../helpers');


describe('app/controller/seatsController', () => {
  let stations;
  let stationIds;
  let route;
  let bus;
  let trip;
  let users;
  before(async () => {
    users = await createUsers(app);
    stations = await createStations(app);
    stationIds = _.map(stations, '_id');
    route = (await createRoutes(app, stationIds))[0];
    bus = (await createBuses(app))[0];
    trip = (await createTrips(app, route._id, bus._id))[0];
  });

  describe('GET /seats/free-seats', () => {
    it('should throw validation error', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .get(`/seats/free-seats?stationFrom=${stationIds[0]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 422);
    });

    it('should throw 400 stations not from trip', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=5e3db9a33b14901924cc5c22&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 400);
    });

    it('should throw 400 stations order wrong', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[1]}&stationTo=${stationIds[0]}`)
        .set('Authorization', token);

      assert.equal(status, 400);
    });

    it('should get all seats', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[0]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.length, 30);
    });

    it('should get 29 seats', async () => {
      const user = users[0];
      await createSeats(app, user._id, trip._id, stationIds[0], stationIds[1], 23);
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[0]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.length, 29);
      assert.equal(body.indexOf(23), -1);
    });

    it('should get 29 seats', async () => {
      const user = users[0];
      await createSeats(app, user._id, trip._id, stationIds[1], stationIds[2], 23);
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[0]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.length, 29);
      assert.equal(body.indexOf(23), -1);
    });

    it('should get all seats', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[2]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.length, 30);
    });

    it('should get 27 seats', async () => {
      const user = users[0];
      await createSeats(app, user._id, trip._id, stationIds[3], stationIds[4], 23);
      await createSeats(app, user._id, trip._id, stationIds[4], stationIds[5], 23);
      await createSeats(app, user._id, trip._id, stationIds[1], stationIds[3], 1);
      await createSeats(app, user._id, trip._id, stationIds[1], stationIds[5], 2);
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .get(`/seats/free-seats?tripId=${trip._id}&stationFrom=${stationIds[2]}&stationTo=${stationIds[5]}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.length, 27);
      assert.equal(body.indexOf(1), -1);
      assert.equal(body.indexOf(2), -1);
      assert.equal(body.indexOf(23), -1);
    });
  });

  describe('POST /seats', () => {
    it('should throw validation error', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          stationFrom: stationIds[0],
          stationTo: stationIds[5],
          seatNumber: 1,
        });

      assert.equal(status, 422);
    });

    it('should throw 400 stations not from trip', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          tripId: trip._id,
          stationFrom: '5e3db9a33b14901924cc5c22',
          stationTo: stationIds[5],
          seatNumber: 1,
        });

      assert.equal(status, 400);
    });

    it('should throw 400 stations order wrong', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          tripId: trip._id,
          stationFrom: stationIds[5],
          stationTo: stationIds[0],
          seatNumber: 1,
        });

      assert.equal(status, 400);
    });

    it('should throw 422 seat number out of bounds', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          tripId: trip._id,
          stationFrom: stationIds[0],
          stationTo: stationIds[5],
          seatNumber: 31,
        });

      assert.equal(status, 422);
    });

    it('should throw 400 seat already taken', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          tripId: trip._id,
          stationFrom: stationIds[0],
          stationTo: stationIds[5],
          seatNumber: 1,
        });

      assert.equal(status, 400);
    });

    it('should create seat', async () => {
      const token = await login(app, 'U');
      const { status, body } = await app
        .httpRequest()
        .post(`/seats`)
        .set('Authorization', token)
        .send({
          tripId: trip._id,
          stationFrom: stationIds[0],
          stationTo: stationIds[5],
          seatNumber: 3,
        });

      assert.equal(status, 200);
      assert(body._id);
      assert.equal(body.seatNumber, 3);
    });
  });



  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Stations.deleteMany({});
    await app.model.Routes.deleteMany({});
    await app.model.Trips.deleteMany({});
    await app.model.Buses.deleteMany({});
    await app.model.Seats.deleteMany({});
  });
});
