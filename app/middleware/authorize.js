const _ = require('lodash');
const { USER_ROLES } = require('../constants');

function isAllowed(path, method, user, { adminRoutes }) {
  if (user.role === USER_ROLES.SUPER_ADMIN) return true;
  const indexOfPath = _.findIndex(adminRoutes, o => {
    return path.startsWith(o.path) && o.methods.includes(method);
  });
  if (indexOfPath === -1 || user.role === USER_ROLES.ADMIN) {
    return true;
  }
}


module.exports = options => {
  return async function(ctx, next) {
    await ctx.app.jwt(ctx, async () => {
      const { user } = ctx.state;
      const userEntity = await ctx.service.usersService.findById(user.id);
      if (!userEntity) {
        return ctx.throw(403, 'User not found');
      }
      if (!isAllowed(ctx.path, ctx.request.method, userEntity, options)) {
        return ctx.throw(401, 'Unauthorized');
      }
      ctx.state.user = userEntity;
      await next();
    });
  };
};
