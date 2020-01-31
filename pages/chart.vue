<template>
  <div class="bar-chart">
    <h2>Grades for Marking Period 3</h2>
    <BarChart />
  </div>
</template>

<script>
import BarChart from '~/components/vue-chart-horiz-2';

export default {
  components: {
    BarChart
  }
};
</script>
