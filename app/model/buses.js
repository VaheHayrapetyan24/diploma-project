const { BUS_TYPES } = require('../constants');

module.exports = ({ mongoose }) => {
  const BusesSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(BUS_TYPES), default: BUS_TYPES.BUS },
    seatCount: { type: Number },
    drivers: [{ type: mongoose.Types.ObjectId, ref: 'drivers' }],
  });

  return mongoose.model('buses', BusesSchema);
};
