module.exports = ({ mongoose }) => {
  const BusStopsSchema = new mongoose.Schema({
    readableAddress: { type: String },
    location: {
      type: { type: String, enum: [ 'Point' ], required: true, default: 'Point' },
      coordinates: { type: [ Number ], required: true },
    },
  });

  return new mongoose.model('busStops', BusStopsSchema);
};
