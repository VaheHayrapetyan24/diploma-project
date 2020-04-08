const _ = require('lodash');
const q2m = require('query-to-mongo');

const Controller = require('egg').Controller;

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.mainService = null;
    this.model = null;
    this.name = 'Resource';
    this.allowedQuery = null;
  }

  get user() {
    return this.ctx.state.user;
  }

  success(data) {
    this.ctx.body = data || { success: true };
  }

  validate(rule, data) {
    const actualData = data || this.ctx.request.body;

    return this.ctx.validate(rule, actualData);
  }

  notFound(instanceName) {
    this.ctx.throw(404, `${instanceName} not found`);
  }

  badRequest(message = 'Invalid request') {
    this.ctx.throw(400, message);
  }

  async getPage() {
    const { service, ctx: { request } } = this;
    const { criteria, options } = this.checkAndBuildMongoQuery(this.ctx.query);

    const contractId = request.get('contract-id');

    const query = criteria;
    if (this.allowedQuery.fields.includes('contractId')) {
      Object.assign(query, { contractId });
    }

    return service.paginationService.findAll(this.model, query, options);
  }

  async index() {
    const page = await this.getPage();

    return this.success(page);
  }

  async show() {
    const { id } = this.ctx.params;
    const record = await this.mainService.findByIdOrThrow(id);
    this.success(this.transformEntry(record));
  }

  async destroy() {
    const { id } = this.ctx.params;
    await this.mainService.findByIdOrThrow(id);
    await this.model.deleteOne({ _id: id });
    this.success({ id });
  }

  checkAndBuildMongoQuery(requestQuery) {
    const request = _.omit(requestQuery, 'skip', 'limit', 'search');
    const query = q2m(request);
    const { valid, message } = this.validateQuery(query);
    if (!valid) {
      return this.badRequest(message);
    }
    query.options = {
      ...query.options,
      skip: requestQuery.skip,
      limit: requestQuery.limit,
    };

    if (requestQuery.search) {
      query.criteria = {
        ...query.criteria,
        $text: { $search: requestQuery.search },
      };
      query.options = {
        ...query.options,
        fields: {
          ...(query.options.fields || {}),
          score: { $meta: 'textScore' },
        },
        sort: {
          ...(query.options.sort || {}),
          score: { $meta: 'textScore' },
        },
      };
    }

    return query;
  }

  validateQuery({ criteria, options }) {
    if (_.isEmpty(criteria) && _.isEmpty(_.omit(options, 'limit'))) {
      return { valid: true };
    }
    if (!this.allowedQuery) {
      return this.badRequest('Query is not allowed');
    }

    const { query, sort } = this.allowedQuery;

    const queryFields = Object.keys(criteria);
    const sortFields = Object.keys(options.sort || {});
    const invalidFields = [];
    invalidFields.push(
      ...queryFields.filter(x => query.indexOf(x) === -1),
      ...sortFields.filter(x => sort.indexOf(x) === -1)
    );

    return {
      valid: invalidFields.length === 0,
      message: `Unknown query attribute or sort: ${invalidFields.join(', ')}`,
    };
  }

  transformPage(page) {
    return page;
  }

  transformEntry(entry) {
    return entry.toObject();
  }
}

module.exports = BaseController;
