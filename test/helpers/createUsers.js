module.exports = async function(app) {
  return app.model.Users.insertMany([
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
};
