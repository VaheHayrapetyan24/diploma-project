module.exports = ({ mongoose }) => {
  const DriversSchema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
    phoneNumber: { type: Number },
  });

  return mongoose.model('drivers', DriversSchema);
};
