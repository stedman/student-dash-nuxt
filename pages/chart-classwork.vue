<template>
  <bar-chart :data="barChartData" />
</template>

<script>
import BarChart from '~/components/vue-chart-bar';
import secret from '~/.secret.json';

// Get studentId from .secret.json
// TODO: this is hard-coded now to grab 1st student
const studentId = Object.keys(secret.student)[0];

export default {
  components: { BarChart },
  async asycnData({ $axios }) {
    try {
      const data = await $axios.$get(
        `http://localhost:3001/api/v1/students/${studentId}/assignments`
      );

      const barChartData = data.map((work) => {
        return {
          labels: [],
          datasets: []
        };
      });

      return barChartData;
    } catch (err) {
      throw new Error(err);
    }
  }
};
</script>
