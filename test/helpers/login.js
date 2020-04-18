module.exports = async function login(app, role) {
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
};
