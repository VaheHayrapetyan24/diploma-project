module.exports = async function(app, routeId, busId, date) {
  return app.model.Trips.insertMany([
    {
      routeId,
      busId,
      dateTime: date || new Date(),
    },
  ]);
};
