module.exports = async function(app) {
  return app.model.Stations.insertMany([
    {
      readableAddress: 'somewhere over the rainbow',
      latitude: 50.444,
      longitude: 60.693,
    },
    {
      readableAddress: 'in your room',
      latitude: 54.444,
      longitude: 60.693,
    },
    {
      readableAddress: 'under your bed',
      latitude: 50.444,
      longitude: 63.693,
    },
  ]);
};
