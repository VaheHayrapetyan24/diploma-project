const Service = require('egg').Service;
const { defaults, omit, includes } = require('lodash');

class PaginationService extends Service {
  constructor(...args) {
    super(...args);
    this.options = {
      limit: 30,
      skip: 0,
    };
  }

  async findAll(model, query = {}, paginationOptions = {}) {
    const options = new Proxy(defaults(paginationOptions, this.options), this.queryHandler());
    const optionsWithoutPagination = omit(options, 'skip', 'limit');
    const requestQuery = Object.assign({}, query);

    const entries = await model.find(requestQuery, options.fields, options)
      .skip(options.skip)
      .limit(options.limit);
    const count = await model.find(requestQuery, optionsWithoutPagination.fields, optionsWithoutPagination)
      .countDocuments();
    const pagination = {
      limit: options.limit,
      skip: options.skip,
      count,
    };

    return {
      entries,
      pagination,
    };
  }

  queryHandler() {
    return {
      get: (target, name) => {
        if (includes([ 'limit', 'skip', 'count' ], name)) {
          target[name] = parseInt(target[name]);
        }

        return name in target ? target[name] : null;
      },
    };
  }
}

module.exports = PaginationService;
