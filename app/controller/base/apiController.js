const BaseController = require('./baseController');

class ApiController extends BaseController {
  async index() {
    const { service, ctx: { request } } = this;
    const { criteria, options } = this.checkAndBuildMongoQuery(this.ctx.query);

    const contractId = request.get('contract-id');
    const query = Object.assign({ contractId }, criteria);

    const page = await service.paginationService.findAll(this.model, query, options);
    return this.success(page);
  }
}

module.exports = ApiController;
