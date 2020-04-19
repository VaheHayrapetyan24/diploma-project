module.exports = ({ mongoose }) => {
  const RoutesSchema = new mongoose.Schema({
    stationIds: [{ type: mongoose.Types.ObjectId, ref: 'stations' }],
  });

  return new mongoose.model('routes', RoutesSchema);
};
