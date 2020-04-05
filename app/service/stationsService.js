const BaseService = require('./base/baseService');

class StationsService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Stations;
    this.name = 'station';
  }
}

module.exports = StationsService;
