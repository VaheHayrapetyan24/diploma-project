const findFreeSeats = {
  tripId: 'mongodbId',
  stationFrom: 'mongodbId',
  stationTo: 'mongodbId',
};

const reserveSeat = {
  tripId: 'mongodbId',
  stationFrom: 'mongodbId',
  stationTo: 'mongodbId',
  seatNumber: {
    type: 'int',
    min: 1,
    max: 40,
  }
}

module.exports = {
  findFreeSeats,
  reserveSeat,
};
