module.exports = {
  name: 'admin',
  exposes: {
    './Routes': 'apps/admin/src/app/remote-entry/entry.routes.ts',
  },
};
