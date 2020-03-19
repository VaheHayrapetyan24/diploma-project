module.exports = ({ mongoose }) => {
  const RoutesSchema = new mongoose.Schema({
    busStopIds: [{ type: mongoose.Types.ObjectId, ref: 'busStops' }],
  });

  return new mongoose.model('routes', RoutesSchema);
};
