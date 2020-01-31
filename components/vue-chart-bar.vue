<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.options = {
      legend: {
        display: true
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
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
        xAxes: [
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
