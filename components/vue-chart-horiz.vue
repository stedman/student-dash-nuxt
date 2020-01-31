<script>
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
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              color: '#333'
            },
            ticks: {
              fontColor: '#ccc',
              stepSize: 5,
              suggestedMin: 80,
              suggestedMax: 100
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              fontColor: '#999'
            }
          }
        ]
      }
    };

    this.renderChart(this.data, this.options);
  }
};
</script>
