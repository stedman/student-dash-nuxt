<template>
  <div>
    <h2>Classwork scores {{ timeframe.label }}</h2>
    <div v-for="student in students" :key="student.id">
      <h3>{{ student.name }}</h3>
      <TimePlot :student="student" />
      <!-- TODO: make timeframe choices interactive.
      <span class="mp-title">Marking Period:</span>
      <span v-for="mp in periods" :key="mp" class="mp-select">
        <label class="mp-label">
          <input :value="mp" v-model="picked" type="radio" class="mp-radio" /> {{ mp }}
        </label>
      </span>
      -->
    </div>
  </div>
</template>

<script>
import TimePlot from '~/components/vue-chart-scatter';

// Start the graph from this many days ago.
const daysOffset = 45;
const dateToday = new Date();
const dayMs = 1000 * 60 * 60 * 24;
const timeframe = {
  label: `for the past ${daysOffset} days`,
  value: {
    min: new Date(dateToday - daysOffset * dayMs),
    max: dateToday
  }
};

export default {
  components: {
    TimePlot
  },
  async asyncData({ $axios }) {
    const students = await $axios.$get('http://localhost:3001/api/v1/students');

    for (let idx = 0; idx < students.length; idx += 1) {
      const student = students[idx];
      // const gradingPeriod = student.gradingPeriod;

      const classworkUrl = `http://localhost:3001/api/v1/students/${student.id}/classwork?all`;
      const classworkData = await $axios.$get(classworkUrl);

      // Graph dates provided by returned interval.
      // student.interval = {
      //   min: new Date(classworkData.interval.start),
      //   max: new Date(classworkData.interval.end)
      // };

      // Use default timeframe interval.
      student.interval = {
        min: timeframe.value.min,
        max: timeframe.value.max
      };

      student.data = Object.entries(classworkData.course)
        .filter(([courseId, courseData]) => {
          return courseData.classwork;
        })
        .map(([courseId, courseData]) => {
          const courseName = courseData.name;

          return courseData.classwork.map((work) => {
            return {
              t: new Date(work.dateDueMs),
              y: work.score === 'M' ? 0 : work.score,
              c: courseName,
              a: work.assignment
            };
          });
        });
    }

    return {
      students,
      timeframe
    };
  }
};
</script>

<style scoped>
h3 {
  margin-top: 1em;
}
</style>
