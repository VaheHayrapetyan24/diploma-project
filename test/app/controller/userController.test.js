const { app, assert } = require('egg-mock/bootstrap');

let token;
let userId;
describe('app/controller/userController', () => {
  describe('POST /users/signup', () => {
    it('should create user', async () => {
      const { status, body } = await app
        .httpRequest()
        .post('/users/signup')
        .send({
          name: 'shithole',
          email: 'shitface@gloryhole.cum',
          password: 'hardcorecumface',
        });

      assert.equal(status, 200);
      assert.equal(body.email, 'shitface@gloryhole.cum');
      assert.equal(body.name, 'shithole');
      userId = body._id;
    });
  });

  describe('POST /users/login', () => {
    it('should login', async () => {
      const { status, text } = await app
        .httpRequest()
        .post('/users/login')
        .send({
          email: 'shitface@gloryhole.cum',
          password: 'hardcorecumface',
        });

      assert.equal(status, 200);
      assert(text);
      token = 'Bearer ' + text;
    });
  });

  describe('GET /users/me', () => {
    it('should get user', async () => {
      const { status, body } = await app
        .httpRequest()
        .get('/users/me')
        .set({ Authorization: token });

      assert.equal(status, 200);
      assert.equal(body._id.toString(), userId.toString());
    });
  });

  describe('POST /users/changepassword', () => {
    it('should throw error', async () => {
      const { status } = await app
        .httpRequest()
        .post('/users/changepassword')
        .send({ oldPassword: 'wrongpass', newPassword: 'pass' })
        .set({ Authorization: token });

      assert.equal(status, 403);
    });

    it('should change the pass', async () => {
      const { status } = await app
        .httpRequest()
        .post('/users/changepassword')
        .send({ oldPassword: 'hardcorecumface', newPassword: 'softcoreanalbeads' })
        .set({ Authorization: token });

      assert.equal(status, 200);
    });
  });

  after(async () => {
    await app.model.Users.deleteMany({});
  });
});
