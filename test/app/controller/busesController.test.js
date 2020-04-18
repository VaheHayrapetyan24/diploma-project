const { app, assert } = require('egg-mock/bootstrap');
const { login, createUsers } = require('../../helpers');
const { BUS_TYPES, BUS_PASSENGER_COUNTS } = require('../../../app/constants');

describe('app/controller/busesController', () => {
  before(async () => {
    await createUsers(app);
  });

  let createdBus;
  describe('POST /buses', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .post('/buses')
        .set('Authorization', token)
        .send({ type: BUS_TYPES.TROLLY });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .post('/buses')
        .set('Authorization', token)
        .send({});

      assert.equal(status, 422);
    });

    it('should create', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .post('/buses')
        .set('Authorization', token)
        .send({ type: BUS_TYPES.TROLLY });

      assert.equal(status, 200);
      assert(body._id);
      assert.equal(body.seatCount, BUS_PASSENGER_COUNTS.TROLLY);
      createdBus = body;
    });
  });

  describe('GET /buses', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .get('/buses')
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should get buses', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get('/buses')
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body.entries[0]._id.toString(), createdBus._id.toString());
    });
  });

  describe('GET /buses/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .get(`/buses/${createdBus._id}`)
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should get bus', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .get(`/buses/${createdBus._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdBus._id.toString());
    });
  });

  describe('PATCH /buses/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .patch(`/buses/${createdBus._id}`)
        .set('Authorization', token)
        .send({ type: BUS_TYPES.BUS });

      assert.equal(status, 401);
    });

    it('should throw validation error', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .patch(`/buses/${createdBus._id}`)
        .set('Authorization', token)
        .send({ type: 'MINIVAN' });

      assert.equal(status, 422);
    });

    it('should patch bus', async () => {
      const token = await login(app, 'A');
      const { status, body } = await app
        .httpRequest()
        .patch(`/buses/${createdBus._id}`)
        .set('Authorization', token)
        .send({ type: BUS_TYPES.BUS });

      assert.equal(status, 200);
      assert.equal(body._id.toString(), createdBus._id.toString());
      assert.equal(body.type, 'BUS');
      assert.equal(body.seatCount, BUS_PASSENGER_COUNTS.BUS);
    });
  });

  describe('DELETE /buses/:id', () => {
    it('should throw unauthorized', async () => {
      const token = await login(app, 'U');
      const { status } = await app
        .httpRequest()
        .delete(`/buses/${createdBus._id}`)
        .set('Authorization', token);

      assert.equal(status, 401);
    });

    it('should delete bus', async () => {
      const token = await login(app, 'A');
      const { status } = await app
        .httpRequest()
        .delete(`/buses/${createdBus._id}`)
        .set('Authorization', token);

      assert.equal(status, 200);
      const bus = await app.model.Buses.findById(createdBus._id);
      assert(!bus);
    });
  });

  after(async () => {
    await app.model.Users.deleteMany({});
    await app.model.Buses.deleteMany({});
  });
});
