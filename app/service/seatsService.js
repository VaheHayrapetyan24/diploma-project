const _ = require('lodash');
const BaseService = require('./base/baseService');
const HttpError = require('../errors/httpError');

class SeatsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Seats;
    this.name = 'seat';
  }

  async reserveSeat({ _id: userId }, trip, stationFrom, stationTo, seatNumber) {
    await this.checkIfSeatIsFree(trip, stationFrom, stationTo, seatNumber);
    return this.create({
      userId,
      tripId: trip._id,
      stationFrom,
      stationTo,
      seatNumber,
    });
  }

  async checkIfSeatIsFree(trip, stationFrom, stationTo, seatNumber) {
    const busSeatCount = this.getBusSeatCount(trip.busId);
    if (seatNumber > busSeatCount) throw new HttpError(422, 'Invalid seat number');
    const freeSeats = await this.findFreeSeats(trip, stationFrom, stationTo);
    if (freeSeats.indexOf(seatNumber) !== -1) return;
    throw new HttpError(400, 'Seat already taken');
  }

  async findFreeSeats(trip, stationFrom, stationTo) {
    this.validateStationIds(trip, stationFrom, stationTo);
    const { routeId: { stationIds }, busId: bus } = trip;
    const {
      beforeStationTo,
      afterStationFrom,
    } = this.getRangeOfStationIds(stationIds, stationFrom, stationTo);
    const takenSeatNumbers = await this.findTakenSeatNumbers(trip._id, beforeStationTo, afterStationFrom);
    return this.getArrayOfFreeSeats(bus, takenSeatNumbers);
  }

  async findTakenSeatNumbers(tripId, beforeStationTo, afterStationFrom) {
    const seats = await this.model
      .find({
        tripId,
        stationFrom: { $in: beforeStationTo },
        stationTo: { $in: afterStationFrom },
      })
      .distinct('seatNumber');
    return seats.sort();
  }

  getArrayOfFreeSeats(bus, takenSeats) {
    const seatCount = this.getBusSeatCount(bus);
    const resultArray = [];
    for (let i = 1, j = 0; i <= seatCount; ++i) {
      if (i === takenSeats[j]) {
        ++j;
        continue;
      }
      resultArray.push(i);
    }
    return resultArray;
  }

  validateStationIds({ routeId: route }, stationFrom, stationTo) {
    const fromIndex = this.findIdIndex(route.stationIds, stationFrom);
    const toIndex = this.findIdIndex(route.stationIds, stationTo);
    if (fromIndex === -1 || toIndex === -1) {
      throw new HttpError(400, 'Station ids are not from specified trip');
    }
    if (fromIndex < toIndex) return;
    throw new HttpError(400, 'Station from should be before station to');
  }

  getRangeOfStationIds(stationIds, stationFrom, stationTo) {
    const beforeStationTo = stationIds.slice(0, this.findIdIndex(stationIds, stationTo));
    const afterStationFrom = stationIds.slice(this.findIdIndex(stationIds, stationFrom) + 1);
    return {
      beforeStationTo,
      afterStationFrom,
    };
  }

  getBusSeatCount(bus) {
    const { busesService } = this.ctx.service;
    return busesService.getSeatCountByType(bus.type);
  }

  findIdIndex(array, id) {
    return _.findIndex(array, i => i.toString() === id.toString());
  }

}

module.exports = SeatsService;
