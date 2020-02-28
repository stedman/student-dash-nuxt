import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const student = this.$options.propsData.student;

    this.data = student.data;

    this.options = {
      layout: {
        padding: {
          top: 32,
          bottom: 32
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: 'hsl(220,25%,75%)'
        }
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'hsl(220,25%,75%)'
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              color: 'hsl(220,25%,25%)',
              zeroLineColor: 'red'
            },
            ticks: {
              fontColor: 'hsl(220,25%,75%)',
              stepSize: 5,
              suggestedMin: 80,
              suggestedMax: 100
            }
          }
        ]
      }
    };

    this.renderChart(this.data, this.options);
  }
};
