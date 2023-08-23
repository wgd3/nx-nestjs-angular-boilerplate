const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const { sharedTailwindConfig } = require('../../libs/shared/ui-tailwind/src');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedTailwindConfig],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    // https://github.com/nrwl/nx/issues/9784
    join(__dirname, '../admin/src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../login/src/**/!(*.stories|*.spec).{ts,html}'),
    // don't forget the libraries!
    join(__dirname, '../../libs/frontend/**/!(*.stories|*.spec).{ts,html}'),
  ],
  // theme: {
  //   extend: {},
  // },
  // plugins: [],
};
