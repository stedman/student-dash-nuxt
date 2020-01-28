    2. Add another flavor of [Vue Chart](https://www.yasminzy.com/nuxt/chart.html)

        1. Install [Vue wrapper](https://github.com/hchstera/vue-charts) of [Chart.js](https://www.chartjs.org/): `npm i chart.js hchs-vue-charts`
        2. Add plugin: `/plugins/hchs-vue-charts.js`

            ```js
            import Vue from 'vue';

            import 'chart.js';
            import 'hchs-vue-charts';

            Vue.use(window.VueCharts);
            ```

        3. Update Nuxt config: `/nuxt.config.js`

            ```json
            plugins: [{ src: "@/plugins/hchs-vue-charts", ssr: false }]
            ```

        4. Add component: `/components/hchs-chart-bar.vue`

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
    
        5. Add page: `/pages/hchs-vue-charts.vue`
    
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
            import ChartBar from '@/components/hchs-vue-charts-bar';
    
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
