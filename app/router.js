module.exports = app => {
  const { router, controller } = app;

  router.post('/users/signup', controller.usersController.signup);
  router.post('/users/login', controller.usersController.login);
  router.get('/users/me', controller.usersController.getUser);
  router.post('/users/changepassword', controller.usersController.changePassword);

  router.resources('/stations', controller.stationsController);
  router.resources('/buses', controller.busesController);
  router.resources('/routes', controller.routesController);
  router.resources('/trips', controller.tripsController);

  router.get('/seats/free-seats', controller.seatsController.findFreeSeats);

  router.get('/public/documentation', controller.documentationController.index);
};
