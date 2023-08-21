import { defaultTheme } from 'vuepress';

module.exports = {
  lang: 'en-US',
  title: 'Nx NestJS Angular Boilerplate',
  description:
    'A full stack template repository utilizing Nx, NestJS, and Angular',
  base:
    process.env.DEPLOY_ENV === 'gh-pages'
      ? '/nx-nestjs-angular-boilerplate/'
      : '/',
  theme: defaultTheme({
    repo: 'wgd3/nx-nestjs-angular-boilerplate',
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'The Full Stack Engineer',
        link: 'https://thefullstack.engineer',
      },
    ],
    sidebarDepth: 1,
    sidebar: [
      {
        text: 'Welcome',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/docs',
        children: ['/docs/GETTING_STARTED', '/docs/ARCHITECTURE'],
      },
    ],
  }),
};
