import { HorizontalBar } from 'vue-chartjs';

export default {
  extends: HorizontalBar,
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.options = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              stepSize: 5,
              suggestedMin: 75,
              suggestedMax: 100
            }
          }
        ]
      }
    };

    this.renderChart(this.data, this.options);
  }
};
