async function createUsers(app) {
  await app.model.Users.insertMany([
    {
      name: 'user',
      email: 'user@mail.com',
      role: 'U',
      password: '$2a$10$eki8Exv6fyrWs87xG3M5reNpZDSQyAI6jXWrJWYvXe0KaH3guUvFu', // softcoreanalbeads
      passwordSalt: '$2a$10$eki8Exv6fyrWs87xG3M5re',
    },
    {
      name: 'admin',
      email: 'admin@mail.com',
      role: 'A',
      password: '$2a$10$eki8Exv6fyrWs87xG3M5reNpZDSQyAI6jXWrJWYvXe0KaH3guUvFu', // softcoreanalbeads
      passwordSalt: '$2a$10$eki8Exv6fyrWs87xG3M5re',
    },
    {
      name: 'superduper',
      email: 'superduper@mail.com',
      role: 'SA',
      password: '$2a$10$eki8Exv6fyrWs87xG3M5reNpZDSQyAI6jXWrJWYvXe0KaH3guUvFu', // softcoreanalbeads
      passwordSalt: '$2a$10$eki8Exv6fyrWs87xG3M5re',
    },
  ]);
}

async function login(app, role) {
  let email;
  switch (role) {
    case 'U':
      email = 'user@mail.com';
      break;
    case 'A':
      email = 'admin@mail.com';
      break;
    case 'SA':
      email = 'superduper@mail.com';
      break;
    default:
      throw new Error('role unknown');
  }
  const { text } = await app
    .httpRequest()
    .post('/users/login')
    .send({
      email,
      password: 'softcoreanalbeads',
    });

  return 'Bearer ' + text;
}

module.exports = {
  createUsers,
  login,
};
