const { withModuleFederation } = require('@nx/angular/module-federation');
const config = require('./module-federation.config');
module.exports = withModuleFederation({
  ...config,
  additionalShared: [
    ['@angular/common', { singleton: true }],
    ['@angular/core', { singleton: true }],
    ['@angular/router', { singleton: true }],
    ['@libs/frontend/data-access-common', { singleton: true }],
  ],
});
