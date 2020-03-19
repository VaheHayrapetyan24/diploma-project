module.exports = ({ mongoose }) => {
  const TripsSchema = new mongoose.Schema({
    routeId: { type: mongoose.Types.ObjectId, ref: 'routes' },
    seats: [{
      seatNumber: { type: Number },
      passenger: { type: mongoose.Types.ObjectId, ref: 'users' },
    }],
  });

  return mongoose.model('trips', TripsSchema);
};
