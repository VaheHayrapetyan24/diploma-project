const BaseService = require('./base/baseService');

class RoutesService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = ctx.model.Routes;
    this.name = 'route';
  }
}

module.exports = RoutesService;
