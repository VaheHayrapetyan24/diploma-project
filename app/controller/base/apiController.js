const BaseController = require('./baseController');

class ApiController extends BaseController {
  async index() {
    const { service } = this;
    const { criteria, options } = this.checkAndBuildMongoQuery(this.ctx.query);
    const query = Object.assign({}, criteria);
    const page = await service.paginationService.findAll(this.model, query, options);
    return this.success(page);
  }
}

module.exports = ApiController;
