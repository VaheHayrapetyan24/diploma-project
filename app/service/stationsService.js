const BaseService = require('./base/baseService');
const _ = require('lodash');
const HttpError = require('../errors/httpError');

class StationsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Stations;
    this.name = 'station';
  }

  async checkIfStationsExistAndThrow(stationIds) {
    const uniqueIds = this.getUniqueIdsArray(stationIds);
    const stationsExist = await this.checkIfStationsExist(uniqueIds);
    if (!stationsExist) {
      throw new HttpError(404, 'All (or some) stations not found');
    }
    return uniqueIds;
  }

  async checkIfStationsExist(stationIds) {
    const foundStations = await this.findStationsInIdArray(stationIds);
    return foundStations.length === stationIds.length;
  }

  async findStationsInIdArray(stationIds) {
    return this.find({ _id: { $in: stationIds } });
  }

  getUniqueIdsArray(ids) {
    return _.uniqWith(ids, (id1, id2) => {
      return id1.toString() === id2.toString();
    });
  }
}

module.exports = StationsService;
