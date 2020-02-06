import { HorizontalBar } from 'vue-chartjs';

export default {
  extends: HorizontalBar,
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const student = this.$options.propsData.student;

    this.data = student.data;

    // this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 1000, 0);
    // this.gradient.addColorStop(0, 'hsla(250,50%,90%,8)');
    // this.gradient.addColorStop(0.5, 'hsla(225,60%,80%,8)');
    // this.gradient.addColorStop(1, 'hsla(150,90%,70%,8)');
    // this.data.datasets[0].backgroundColor = this.gradient;

    this.options = {
      legend: {
        display: true,
        position: 'bottom'
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
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
