module.exports = ({ mongoose }) => {
  const SeatsSchema = new mongoose.Schema({
    tripId: { type: mongoose.Types.ObjectId, required: true, ref: 'trips' },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    stationFrom: { type: mongoose.Types.ObjectId, required: true, ref: 'stations' },
    stationTo: { type: mongoose.Types.ObjectId, required: true, ref: 'stations' },
    seatNumber: { type: Number, required: true },
  });

  return new mongoose.model('seats', SeatsSchema);
};
