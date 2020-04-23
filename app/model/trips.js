module.exports = ({ mongoose }) => {
  const TripsSchema = new mongoose.Schema({
    routeId: { type: mongoose.Types.ObjectId, ref: 'routes' },
    busId: { type: mongoose.Types.ObjectId, ref: 'buses' },
    dateTime: { type: Date, required: true },
  });

  return mongoose.model('trips', TripsSchema);
};
