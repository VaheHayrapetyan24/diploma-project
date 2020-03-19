// Wrapper for egg-jwt. Without it plugin middlewares executed at the end
module.exports = () => {
  return async function(ctx, next) {
    await ctx.app.jwt(ctx, async () => {
      const { user } = ctx.state;
      const userEntity = await ctx.service.userService.findById(user.id);
      if (!userEntity) {
        ctx.throw(403, 'User not found');
      }
      ctx.state.user = userEntity;
      await next();
    });
  };
};
