import { HorizontalBar } from 'vue-chartjs';

export default {
  extends: HorizontalBar,
  props: ['data', 'options'],
  async mounted($axios) {
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 1000, 0);

    this.gradient.addColorStop(0, 'hsla(250,50%,90%,8)');
    this.gradient.addColorStop(0.5, 'hsla(225,60%,80%,8)');
    this.gradient.addColorStop(1, 'hsla(150,90%,70%,8)');

    const gradeData = await this.$axios.$get(
      'http://localhost:3001/api/v1/students/109683/grades/snapshot/4'
    );

    this.data = {
      labels: gradeData.course_grade_average.map((course) => course.courseName),
      datasets: [
        {
          backgroundColor: this.gradient,
          borderColor: 'hsla(0,100%,100%,.9)',
          borderWidth: 1,
          data: gradeData.course_grade_average.map((course) => course.average)
        }
      ]
    };
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
