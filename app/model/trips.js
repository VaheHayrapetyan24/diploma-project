module.exports = ({ mongoose }) => {
  const TripsSchema = new mongoose.Schema({
    // todo you need to keep one of these for each of seats taken for each user
    routeId: { type: mongoose.Types.ObjectId, ref: 'routes' },
    busId: { type: mongoose.Types.ObjectId, ref: 'buses' },
    dateTime: { type: Date, required: true },
  });

  return mongoose.model('trips', TripsSchema);
};
