module.exports = async function(app, ids) {
  return app.model.Routes.insertMany([
    {
      stationIds: ids,
    },
  ]);
};
