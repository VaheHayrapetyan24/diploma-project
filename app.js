const { mongodbId, password } = require('./app/validation/customValidators');

// const Sentry = require('@sentry/node');

class AppBootHook {
  constructor(app) {
    this.app = app;
    // if (app.config.sentry && app.config.sentry.dsn) {
    //   Sentry.init({ dsn: app.config.sentry.dsn });
    //   console.log('** Sentry initialized **');
    // }

    console.log('** API Ready **');
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
    this.app.validator.addRule('mongodbId', mongodbId);
    this.app.validator.addRule('password', password);
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.
    // All plugins have started, can do some thing before app ready
  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = app => app;

module.exports = AppBootHook;
