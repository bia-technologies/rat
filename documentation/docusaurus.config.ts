import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rehypeShiki from "@shikijs/rehype";


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'RAT Community',
  tagline: 'Расширение для автоматизации тестирования в 1С:Предприятие',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://bia-technologies.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/rat/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bia-technologies', // Usually your GitHub org/user name.
  projectName: 'rat', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  // Включить поддержку Mermaid диаграмм
  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: undefined,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/bia-technologies/rat/tree/develop/doc/',
          // Автогенерация сайдбара на основе структуры файлов
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          // Настройки для автогенерации
          routeBasePath: 'docs',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          beforeDefaultRehypePlugins: [ 
            [ 
              rehypeShiki,
              {
                themes: {
                  light: 'light-plus',
                  dark: 'dark-plus'
                },
                langs: ['bsl', 'json', 'gherkin', 'bat', 'bash', 'apache', 'http'],
              },
            ],
          ],
        },
        blog: false, // Отключаем блог
        theme: {
          customCss: 'src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'RAT Community',
      logo: {
        alt: 'RAT Community Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'functionality/index',
          position: 'left',
          label: 'Документация',
        },
        {
          type: 'doc',
          docId: 'faq/index',
          position: 'left',
          label: 'FAQ',
        },
        {
          href: 'https://github.com/bia-technologies/rat',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // Настройка поиска Algolia
    algolia: {
      // Algolia search configuration
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'bia-technologies',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {
              label: 'Установка',
              to: '/docs/install',
            }
          ],
        },
        {
          title: 'Сообщество',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/bia-technologies/rat',
            },
            {
              label: 'Issues',
              href: 'https://github.com/bia-technologies/rat/issues',
            },
          ],
        },
        {
          title: 'Проект',
          items: [
            {
              label: 'Contributing',
              to: '/docs/contributing',
            },
            {
              label: 'Лицензия',
              href: 'https://github.com/bia-technologies/rat?tab=LGPL-3.0-1-ov-file',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RAT Community. Built with Docusaurus.`,
    },
    // Настройка Mermaid диаграмм
    mermaid: {
      theme: {
        light: 'default',
        dark: 'dark',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
