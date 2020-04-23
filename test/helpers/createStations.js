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
    {
      readableAddress: 'in the darkest pits of hell',
      latitude: 53.444,
      longitude: 44.693,
    },
    {
      readableAddress: 'in the midst of an economical crisis',
      latitude: 66.444,
      longitude: 63.693,
    },
    {
      readableAddress: 'in someones gaping hole',
      latitude: 42.044,
      longitude: 56.693,
    },
  ]);
};
