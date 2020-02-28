<template>
  <div class="bar-chart">
    <h2>Grade averages by Course and Grading Period</h2>
    <div v-for="student in students" :key="student.id">
      <h3>{{ student.name }}</h3>
      <BarChart :student="student" />
    </div>
  </div>
</template>

<script>
import BarChart from '~/components/vue-chart-bar';

export default {
  components: {
    BarChart
  },
  async asyncData({ $axios }) {
    const students = await $axios.$get('http://localhost:3001/api/v1/students');

    for (let idx = 0; idx < students.length; idx += 1) {
      const barHue = 60;

      const student = students[idx];
      const gradingPeriod = student.gradingPeriod;

      student.data = {};
      student.data.datasets = [];

      for (let run = 1; run <= gradingPeriod; run += 1) {
        const avgUrl = `http://localhost:3001/api/v1/students/${student.id}/grades/average?runId=${run}`;
        const gradeData = await $axios.$get(avgUrl);

        // Get complete list of course labels from first Grading Period
        if (run === 1 && gradeData.grades) {
          student.data.labels = gradeData.grades.map((course) => course.courseName);
        }

        student.data.datasets.push({
          label: run,
          backgroundColor: `hsl(${barHue * run},70%,60%)`,
          borderColor: `hsl(0,0%,0%)`,
          borderWidth: 1,
          data: gradeData.grades.map((course) => course.average)
        });
      }
    }

    return {
      students
    };
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 1em;
}
</style>
