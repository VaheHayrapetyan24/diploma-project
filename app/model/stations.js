module.exports = ({ mongoose }) => {
  const StationsSchema = new mongoose.Schema({
    readableAddress: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });

  return new mongoose.model('stations', StationsSchema);
};
