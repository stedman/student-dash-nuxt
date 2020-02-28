import { Scatter } from 'vue-chartjs';

export default {
  extends: Scatter,
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const student = this.$options.propsData.student;
    const courses = student.data;
    const initialHue = 360 / courses.length;

    const datasets = courses.map((course, idx) => {
      return {
        label: course[0] ? course[0].c : '',
        // applies to legend
        backgroundColor: `hsla(${initialHue * idx}, 60%, 50%, 0.75)`,
        borderWidth: 0,
        // applies to data bubbles and tooltip
        pointBackgroundColor: `hsla(${initialHue * idx}, 60%, 60%, 0.5)`,
        pointRadius: 20,
        pointHoverRadius: 25,
        data: course
      };
    });

    this.data = {
      datasets
    };

    const color = {
      legend: 'hsl(220,25%,50%)',
      axes: 'hsl(220,25%,75%)'
    };
    this.options = {
      layout: {
        padding: {
          top: 32,
          bottom: 32
        }
      },
      legend: {
        labels: {
          boxWidth: 20,
          fontSize: 14,
          fontColor: color.legend,
          padding: 20
        },
        position: 'bottom'
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM D'
            },
            ticks: {
              fontColor: color.axes,
              source: 'label',
              min: student.interval.min,
              max: student.interval.max
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              color: 'hsl(220,25%,25%)'
            },
            ticks: {
              fontColor: color.axes,
              max: 100,
              min: 50
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: (tt, data) => {
            const pointData = data.datasets[tt.datasetIndex].data[tt.index];
            return `${tt.label}【${tt.value}】 ${pointData.c} - "${pointData.a}"`;
          }
        }
      }
    };

    this.renderChart(this.data, this.options);
  }
};
