module.exports = app => {
  const { router, controller } = app;

  router.post('/users/signup', controller.userController.signup);
  router.post('/users/login', controller.userController.login);
  router.get('/users/me', controller.userController.getUser);
  router.post('/users/changepassword', controller.userController.changePassword);
};
