const BaseService = require('./base/baseService');
const _ = require('lodash');

class SeatsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Seats;
    this.name = 'seat';
  }

  async reserveSeat(userId, tripId, stationFrom, stationTo, seatNumber) {
    await this.checkIfSeatIsFree(tripId, stationFrom, stationTo, seatNumber);
    return this.create({
      tripId,
      stationFrom,
      stationTo,
      seatNumber,
    });
  }

  async checkIfSeatIsFree(tripId, stationFrom, stationTo, seatNumber) {
    const freeSeats = await this.findFreeSeats(tripId, stationFrom, stationTo);
    return freeSeats.indexOf(seatNumber) !== -1;
  }

  async findFreeSeats(tripId, stationFrom, stationTo) {
    const { tripsService } = this.ctx.service;
    const trip = await tripsService.findByIdWithPopulatedIds(tripId);
    const { stationIds } = trip.routeId;
    const bus = trip.busId;
    const {
      beforeStationTo,
      afterStationFrom,
    } = this.getRangeOfStationIds(stationIds, stationFrom, stationTo);
    const takenSeats = await this.findTakenSeats(tripId, beforeStationTo, afterStationFrom);
    return this.getArrayOfFreeSeats(bus, takenSeats);
  }

  async findTakenSeats(tripId, beforeStationTo, afterStationFrom) {
    return this.model
      .find({
        tripId,
        stationFrom: { $in: beforeStationTo },
        stationTo: { $in: afterStationFrom },
      })
      .sort({ seatNumber: 1 });
  }

  getArrayOfFreeSeats(bus, takenSeats) {
    const { busesService } = this.ctx.service;
    const seatCount = busesService.getSeatCountByType(bus.type);
    const resultArray = [];
    let i = 1;
    /* eslint-disable no-sequences */
    for (let j = 0; i <= seatCount, j < takenSeats.length;) {
      if (i === takenSeats[j].seatNumber) {
        if (++j === takenSeats.length) {
          ++i;
          break;
        }
        continue;
      }
      resultArray.push(i);
      ++i;
    }
    while (i <= seatCount) {
      resultArray.push(i);
      ++i;
    }
    return resultArray;
  }

  getRangeOfStationIds(stationIds, stationFrom, stationTo) {
    const beforeStationTo = stationIds.slice(0, this.findIdIndex(stationIds, stationTo));
    const afterStationFrom = stationIds.slice(this.findIdIndex(stationIds, stationFrom) + 1);
    return {
      beforeStationTo,
      afterStationFrom,
    };
  }

  findIdIndex(array, id) {
    return _.findIndex(array, i => i.toString() === id.toString());
  }

}

module.exports = SeatsService;
