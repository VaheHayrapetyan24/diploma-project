module.exports = async function(app, userId, tripId, stationFrom, stationTo, seatNumber) {
  return app.model.Seats.insertMany([
    {
      userId,
      tripId,
      stationFrom,
      stationTo,
      seatNumber,
    },
  ]);
};
