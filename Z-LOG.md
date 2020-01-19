# Install/setup log

1. Install NuxtJS: `npx create-nuxt-app grade-vue`

    Options:
    * package manager: `npm`
    * UI framework: `none`
    * server framework: `Express`
    * linting: `ESLint, prettier`
    * test framework: `Jest`
    * rendering mode: `Universal (SSR)`
    * dev tools: `jsconfig.json`

    Then get into the app directory: `cd grade-vue`
2. Configure settings
    * To `.eslintrc.js` add:

      ```json
      "rules": { "vue/html-self-closing": "off" }
      ```

    * Make VSCode play nice with `.vue` files (especially `<template>` code). Create `.vscode/settings.json` and add:

      ```json
      {
        "editor.formatOnSave": false,
        "javascript.format.enable": false,
        "eslint.alwaysShowStatus": true,
        "eslint.options": {
          "extensions": [ ".html", ".js", ".vue", ".jsx" ]
        },
        "eslint.validate": [
          { "language": "html", "autoFix": true },
          { "language": "vue", "autoFix": true },
          { "language": "javascript", "autoFix": true },
          { "language": "javascriptreact", "autoFix": true }
        ],
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": true
        }
      }
      ```

      Source: https://stackoverflow.com/a/52259752

    * Fix issue with Jest tests failing because Babel isn't running. This seems to be because Jest isn't setting `NODE_ENV` properly. Choose one of the following solutions: 
        * Set the env variable every time we run Jest. 

          Change the test script in `package.json` to:

          ```json
          "scripts": {
            "test": "env NODE_ENV=test jest"
          }
          ```

        * When Nuxt pre-configures Babel, it nests the `presets` in `env.test`. If Jest doesn't set `NODE_ENV` to `test`, then Babel never runs `preset`. Fix that by running `presets` all the time. 

          Replace the contents of `.babelrc` with:

          ```json
          {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "targets": {
                    "node": "current"
                  }
                }
              ]
            ]
          }
          ```

3. Add [axios](https://github.com/axios/axios): `npm i axios`
4. Add [Vue Charts](https://www.yasminzy.com/nuxt/chart.html#steps)

    1. Install [Vue wrapper](https://github.com/hchstera/vue-charts) of [Charts.js](https://www.chartjs.org/): `npm i charts.js hchs-vue-charts`
    2. Add plugin: `/plugins/chart.js`

        ```js
        import Vue from 'vue';

        import 'chart.js';
        import 'hchs-vue-charts';

        Vue.use(window.VueCharts);
        ```

    3. Update Nuxt config: `/nuxt.config.js`

        ```json
        plugins: [{ src: "@/plugins/chart", ssr: false }]
        ```

    4. Add component: `/components/chart-bar.vue`

        > Note: [Charts.js](https://www.chartjs.org/) and [FusionCharts](https://fusioncharts.github.io/) look to be the main contenders for Vue-friendly chart libraries. Both have formidable features and good documentation (e.g., [Charts.js](https://www.chartjs.org/docs/latest/), [FusionCharts](https://fusioncharts.github.io/vue-fusioncharts/)). The choice to go with [<abbr title="Free Open Source">FOS</abbr>] Charts.js was easy after considering [FusionCharts pricing model](https://www.fusioncharts.com/buy).

        ```html
        <template>
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Bar</h2>
            </div>
            <div class="card-img-bottom">
              <canvas id="fooCanvas" count="2" />
              <chartjs-bar
                v-for="(item, index) in types"
                :key="index"
                :backgroundcolor="item.bgColor"
                :beginzero="beginZero"
                :bind="true"
                :bordercolor="item.borderColor"
                :data="item.data"
                :datalabel="item.dataLabel"
                :labels="labels"
                target="fooCanvas"
              />
            </div>
          </div>
        </template>

        <script>
        export default {
          data() {
            return {
              beginZero: true,
              labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              types: [
                {
                  bgColor: '#de98ab',
                  borderColor: '0c0306',
                  data: [1, 3, 5, 7, 2, 4, 6],
                  dataLabel: 'Bar'
                },
                {
                  bgColor: '#98ddde',
                  borderColor: '030c0c',
                  data: [1, 5, 2, 6, 3, 7, 4],
                  dataLabel: 'Baz'
                }
              ]
            };
          }
        };
        </script>
        ```

    5. Add page: `/pages/chart.vue`

        ```html
        <template>
          <no-ssr>
            <div>
              <h1>Chart Demo</h1>
              <div class="grid">
                <ChartBar />
              </div>
            </div>
          </no-ssr>
        </template>

        <script>
        import ChartBar from '@/components/chart-bar';

        export default {
          components: {
            ChartBar
          }
        };
        </script>

        <style scoped>
        .grid {
          display: grid;
          row-gap: 2rem;
        }
        </style>
        ```

