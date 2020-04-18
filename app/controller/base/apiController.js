const BaseController = require('./baseController');

class ApiController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.bodyValidation = {
      create: {},
      update: {},
    };
  }

  async index() {
    const { service } = this;
    const { criteria, options } = this.checkAndBuildMongoQuery(this.ctx.query);
    const query = Object.assign({}, criteria);
    const page = await service.paginationService.findAll(this.model, query, options);
    return this.success(page);
  }

  async create() {
    this.validate(this.bodyValidation.create);
    const { request: { body } } = this.ctx;
    const entity = await this.mainService.create(body);
    this.success(entity);
  }

  async update() {
    this.validate(this.bodyValidation.update);
    const { request: { body }, params: { id } } = this.ctx;
    await this.mainService.findByIdOrThrow(id);
    const entity = await this.mainService.updateById(id, body);
    this.success(entity);
  }
}

module.exports = ApiController;
