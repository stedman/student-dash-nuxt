<template>
  <div class="bar-chart">
    <h2>Grade averages by Marking Period</h2>
    <div v-for="student in students" :key="student.id">
      <h3>{{ student.name }}</h3>
      <BarChart :student="student" />
    </div>
  </div>
</template>

<script>
import BarChart from '~/components/vue-chart-horiz-2';
const currentRun = 4;

export default {
  components: {
    BarChart
  },
  async asyncData({ $axios }) {
    const students = await $axios.$get('http://localhost:3001/api/v1/students');

    for (let idx = 0; idx < students.length; idx += 1) {
      const student = students[idx];
      const barHue = 60;

      student.data = {};
      student.data.datasets = [];

      for (let run = 1; run <= currentRun; run += 1) {
        const avgUrl = `http://localhost:3001/api/v1/students/${student.id}/grades/average?run=${run}`;
        const gradeData = await $axios.$get(avgUrl);

        if (run === currentRun) {
          student.data.labels = gradeData.course_grade_average.map((course) => course.courseName);
        }

        student.data.datasets.push({
          label: `MP${run}`,
          backgroundColor: `hsl(${barHue * run},70%,60%)`,
          borderColor: `hsl(0,0%,0%)`,
          borderWidth: 1,
          data: gradeData.course_grade_average.map((course) => course.average)
        });
      }
    }
    // eslint-disable-next-line no-console
    console.log(students);

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
