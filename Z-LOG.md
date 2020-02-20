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

3. Activate [@nuxt/axios](https://axios.nuxtjs.org/) (also see: [axios](https://github.com/axios/axios)).

    Update `nuxt.config.js` to:

    ```json
    modules: [ '@nuxtjs/axios' ],
    ```

4. Add Vue version of Chart.js

    > Note: [Charts.js](https://www.chartjs.org/) and [FusionCharts](https://fusioncharts.github.io/) look to be the main contenders for Vue-friendly chart libraries. Both have formidable features and good documentation (e.g., [Charts.js](https://www.chartjs.org/docs/latest/), [FusionCharts](https://fusioncharts.github.io/vue-fusioncharts/)). The choice to go with [<abbr title="Free Open Source">FOS</abbr>] Charts.js was easy after considering [FusionCharts pricing model](https://www.fusioncharts.com/buy).

    > Clues to the following config were hard to come by, but eventually uncovered deep in the [Nuxt commits](https://github.com/nuxt/nuxt.js/commit/d9ea41e97196b570cc9452c1e352e0613f5ed0c4#diff-21f3f273afa330b4793d01da4d0bd693). Yet another [attempt to integrate vue-chartjs into Nuxt](https://gist.github.com/rvanzon/096132b7b46be43659cf26360c664e9a) was found in a gist, but wasn't needed. Perhaps the component we created should be moved to plugins(?).

    1. Add [Vue-Chartjs](https://vue-chartjs.org/): `npm i chart.js vue-chartjs`
    2. Append vendor build info to Nuxt config: `/nuxt.config.js`

        ```json
        build: {
          vendor: ["chart.js", "vue-chartjs"]
        }
        ```
    3. Add JS component: `/components/vue-chart-bar.js`

        ```js
        import { Bar } from 'vue-chartjs';

        export default {
          extends: Bar,
          props: ['data', 'options'],
          mounted() {
            this.renderChart(this.data, this.options);
          }
        };
        ```

    4. Add page: `/pages/chart.vue`

        ```html
        <template>
          <div class="bar-chart">
            <BarChart :data="barChartData" :options="{ maintainAspectRatio: false }" />
          </div>
        </template>

        <script>
        import BarChart from '~/components/vue-chart-bar';

        export default {
          components: {
            BarChart
          },
          asyncData() {
            return {
              barChartData: {
                labels: [
                  'reading',
                  'writing',
                  'arithmetic'
                ],
                datasets: [
                  {
                    label: 'course',
                    data: [92.96, 99.0, 90.13]
                  }
                ]
              }
            };
          }
        };
        </script>
        ```

    5. Connect chart to live grade data.

        1. Add chart component
        2. Connect component to parent

    6. Add Weather and Lunch data
    7. Restyle CSS grid.
    8. Add dotenv and move secrets there.
    9. [Configured VSCode to debug Nuxt on Firefox](https://medium.com/js-dojo/debugging-nuxt-js-with-vs-code-60a1a9e75cf6)
